package main

import (
	"context"
	"flag"
	"fmt"
	"log"
	"net"

	pb "backend-servers/registrationServer/protobuf"

	"google.golang.org/grpc"
)

var (
	port = flag.Int("port", 8000, "The server port")
)

// server is used to implement helloworld.GreeterServer.
type server struct {
	pb.UnimplementedGreeterServer
	pb.UnimplementedDeviceRegistrationServer
}

// SayHello implements helloworld.GreeterServer
func (s *server) SayHello(ctx context.Context, in *pb.HelloRequest) (*pb.HelloReply, error) {
	log.Printf("Received: %v", in.GetName())
	return &pb.HelloReply{Message: "Hello " + in.GetName()}, nil
}

func (s *server) RegisterDevice(ctx context.Context, in *pb.DeviceRegistrationRequest) (*pb.DeviceRegistrationResponse, error) {
	log.Printf("recived registration request from %s", in.GetDeviceMacAdd())
	return &pb.DeviceRegistrationResponse{
		Status:         1,
		ServerUrl:      "test",
		UniqueSystemId: "test",
		ErrorMsg:       "test",
	}, nil
}

func main() {
	flag.Parse()
	lis, err := net.Listen("tcp", fmt.Sprintf(":%d", *port))
	if err != nil {
		log.Fatalf("failed to listen: %v", err)
	}
	s := grpc.NewServer()
	pb.RegisterDeviceRegistrationServer(s, &server{})
	pb.RegisterGreeterServer(s, &server{})
	log.Printf("server listening at %v", lis.Addr())
	if err := s.Serve(lis); err != nil {
		log.Fatalf("failed to serve: %v", err)
	}
}
