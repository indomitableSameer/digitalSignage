import deviceRegistration_pb2
import deviceRegistration_pb2_grpc

async def registerDevice(grpcChannel) -> None:
    stub = deviceRegistration_pb2_grpc.DeviceRegistrationStub(channel=grpcChannel)
    response = stub.RegisterDevice(deviceRegistration_pb2.DeviceRegistrationRequest(device_mac_add="test1", device_unique_id="test1", fw_version="test1", os_version="test1"))
    print(response)