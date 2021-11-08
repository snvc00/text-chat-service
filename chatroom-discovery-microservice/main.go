package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"net/rpc"
)

type ChatServer struct {
	Title       string `json:"title"`
	UsersCount  uint64 `json:"usersCount"`
	Host        string `json:"host"`
	Image       string `json:"image"`
	Description string `json:"description"`
}

var rooms []map[string]string

func HandleChatRooms(response http.ResponseWriter, request *http.Request) {
	response.Header().Set("Content-Type", "application/json")
	response.Header().Set("Access-Control-Allow-Origin", "*")

	if request.Method == "GET" {
		chatrooms := getChatRooms()
		fmt.Fprintf(response, chatrooms)
	}
}

func getChatRooms() string {
	availableRooms := make([]ChatServer, 0)

	for i := 0; i < len(rooms); i++ {
		client, err := rpc.DialHTTP("tcp", rooms[i]["host"])
		if err != nil {
			fmt.Println(err)
			continue
		}

		var roomInformation ChatServer
		err = client.Call("ChatServer.Information", 0, &roomInformation)
		if err != nil {
			fmt.Println(err)
			continue
		}

		availableRooms = append(availableRooms, roomInformation)
	}

	availableRoomsJson, err := json.MarshalIndent(availableRooms, "", "    ")
	if err != nil {
		fmt.Println(err)
	}

	return string(availableRoomsJson)
}

func main() {
	var totalRooms int
	var roomService, roomHost string
	rooms = make([]map[string]string, 0)

	fmt.Print("Discovery microservice configuration\nTotal chat rooms to register: ")
	fmt.Scanln(&totalRooms)

	for i := 0; i < totalRooms; i++ {
		fmt.Print("---\nChat room #", i+1, "\nService name: ")
		fmt.Scanln(&roomService)
		fmt.Print("Host: ")
		fmt.Scanln(&roomHost)

		chatroom := make(map[string]string)
		chatroom["name"] = roomService
		chatroom["host"] = roomHost
		rooms = append(rooms, chatroom)
		fmt.Println("Service", roomService, "running on", roomHost, "registered successfully")
	}

	http.HandleFunc("/chatrooms", HandleChatRooms)
	fmt.Println("Server running...\nhttp://localhost:8000/chatrooms")
	http.ListenAndServe("localhost:8000", nil)
}
