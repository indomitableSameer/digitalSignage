#!/usr/bin/env bash

set -x

CSR=zymbit.csr
LIBZKPKCS11_SO_NAME="libzk_pkcs11.so"
PKCS11_ENGINE_FOR_CURL="zymkey_ssl"

function find_library() {
  LIBZKPKCS11_SO=$(find /usr/lib -name "$LIBZKPKCS11_SO_NAME" | head -n 1)
}

function finish() {
  if [ -z "$LIBZKPKCS11_SO" ]; then
    find_library
  fi

  #./bootstrap-common.sh $CSR $LIBZKPKCS11_SO $PKCS11_ENGINE_FOR_CURL
  exit 0
}

if [ -f "$CSR" ]; then
  echo "$CSR already exists, skipping CSR generation"
  finish
fi

function error() {
  echo "ERROR: $1"
  exit 1
}

APT_GET=$(which apt-get)
INSTALLER_UPDATE=$APT_GET
INSTALLER=$APT_GET

# Avoid preinst and postinst tasks from asking questions
export DEBIAN_FRONTEND=noninteractive
INSTALLER_SPECIFIC_PACKAGES="jq python3-pip opensc"

sudo $INSTALLER update -y
sudo $INSTALLER upgrade -y
sudo $INSTALLER install -y $INSTALLER_SPECIFIC_PACKAGES

#sudo pip3 install awscli

hash zk_pkcs11-util &>/dev/null

if [ $? -ne 0 ]; then
  echo "ERROR: zk_pkcs11-util not found, running Zymbit installer. Re-run the HSI bootstrap after the device reboots."
  curl -G https://s3.amazonaws.com/zk-sw-repo/install_zk_sw.sh | sudo bash
fi

# Make sure the user is added to the necessary group so they can use the tools later without being root
sudo usermod -a -G zk_pkcs11 $USER

hash pkcs11-tool &>/dev/null

if [ $? -ne 0 ]; then
  error "pkcs11-tool not found, on Debian based distros install opensc"
fi

find_library

if [ -z "$LIBZKPKCS11_SO" ]; then
  error "$LIBZKPKCS11_SO_NAME not found, can not continue"
fi

sudo pkcs11-tool --login --module $LIBZKPKCS11_SO --list-objects --pin 1234 2>&1 | grep -q devicekey >/dev/null

if [ $? -ne 0 ]; then
  SLOT_NUMBER=$(sudo zk_pkcs11-util --init-token --slot 0 --label "device" --pin 1234 --so-pin 1234)
  ID=$(sudo zk_pkcs11-util --show-slot | grep "SoftHSM slot ID" | head -1 | cut -f2 -d"x")
  if [ $? -ne 0 ]; then
    error "Failed to initialize token with zk_pkcs11-util"
  fi

  sudo zk_pkcs11-util --use-zkslot 0 --slot $SLOT_NUMBER --label devicekey --id $ID --pin 1234
else
  echo "Keys already exist, skipping token initialization and private key creation"
fi

sudo openssl req -nodes -key "pkcs11:token=device;object=devicekey;type=private" -new -out $CSR -engine $PKCS11_ENGINE_FOR_CURL -keyform e -subj "/CN=b8:27:eb:e8:40:6f"

if [ ! -f "$CSR" ]; then
  error "The CSR file [$CSR] was not found. CSR generation failed."
fi

sudo chown $USER $CSR

if [ ! -f "bootstrap-common.sh" ]; then
  error "bootstrap-common.sh was not found, you will have to manually sign the CSR, activate the certificate, and copy the certificate file back to this device."
fi

finish
