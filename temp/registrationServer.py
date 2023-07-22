from concurrent import futures
import logging
import os
import grpc
from protos import fileTransfer_pb2, fileTransfer_pb2_grpc


def get_filepath(filename, extension):
    return f'{filename}{extension}'

class fileTransfer(fileTransfer_pb2_grpc.fileTransferServicer):
    #def SayHello(self, request, context):
        #return fileTransfer_pb2.StringResponse(message=f'Hello, {request.name}! I am cluster')

    def UploadFile(self, request_iterator, context):
        print("file upload request received")
        data = bytearray()
        filepath = 'dummy'

        for request in request_iterator:
            if request.metadata.filename and request.metadata.extension:
                filepath = get_filepath(request.metadata.filename+"downloaded", request.metadata.extension)
                continue
            data.extend(request.chunk_data)
        with open(filepath, 'wb') as f:
            f.write(data)
        return fileTransfer_pb2.StringResponse(message='Success!')

    def DownloadFile(self, request, context):
        chunk_size = 1024

        filepath = f'{request.filename}{request.extension}'
        print("Download file request.." + filepath)
        if os.path.exists(filepath):
            with open(filepath, mode="rb") as f:
                while True:
                    chunk = f.read(chunk_size)
                    if chunk:
                        entry_response = fileTransfer_pb2.FileResponse(chunk_data=chunk)
                        yield entry_response
                    else:  # The chunk was empty, which means we're at the end of the file
                        return


def serve():
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=4))
    fileTransfer_pb2_grpc.add_fileTransferServicer_to_server(fileTransfer(), server)
    server.add_insecure_port('[::]:50051')
    server.start()
    server.wait_for_termination()


if __name__ == '__main__':
    logging.basicConfig()
    serve()