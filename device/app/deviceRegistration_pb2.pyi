from google.protobuf.internal import enum_type_wrapper as _enum_type_wrapper
from google.protobuf import descriptor as _descriptor
from google.protobuf import message as _message
from typing import ClassVar as _ClassVar, Optional as _Optional, Union as _Union

DESCRIPTOR: _descriptor.FileDescriptor

class RegistrationStatus(int, metaclass=_enum_type_wrapper.EnumTypeWrapper):
    __slots__ = []
    REG_SUCCESSFUL: _ClassVar[RegistrationStatus]
    REG_UNSUCCESSFUL: _ClassVar[RegistrationStatus]
    REG_ERROR: _ClassVar[RegistrationStatus]
REG_SUCCESSFUL: RegistrationStatus
REG_UNSUCCESSFUL: RegistrationStatus
REG_ERROR: RegistrationStatus

class DeviceRegistrationRequest(_message.Message):
    __slots__ = ["device_mac_add", "device_unique_id", "fw_version", "os_version"]
    DEVICE_MAC_ADD_FIELD_NUMBER: _ClassVar[int]
    DEVICE_UNIQUE_ID_FIELD_NUMBER: _ClassVar[int]
    FW_VERSION_FIELD_NUMBER: _ClassVar[int]
    OS_VERSION_FIELD_NUMBER: _ClassVar[int]
    device_mac_add: str
    device_unique_id: str
    fw_version: str
    os_version: str
    def __init__(self, device_mac_add: _Optional[str] = ..., device_unique_id: _Optional[str] = ..., fw_version: _Optional[str] = ..., os_version: _Optional[str] = ...) -> None: ...

class DeviceRegistrationResponse(_message.Message):
    __slots__ = ["status", "server_url", "unique_system_id", "error_msg"]
    STATUS_FIELD_NUMBER: _ClassVar[int]
    SERVER_URL_FIELD_NUMBER: _ClassVar[int]
    UNIQUE_SYSTEM_ID_FIELD_NUMBER: _ClassVar[int]
    ERROR_MSG_FIELD_NUMBER: _ClassVar[int]
    status: RegistrationStatus
    server_url: str
    unique_system_id: str
    error_msg: str
    def __init__(self, status: _Optional[_Union[RegistrationStatus, str]] = ..., server_url: _Optional[str] = ..., unique_system_id: _Optional[str] = ..., error_msg: _Optional[str] = ...) -> None: ...
