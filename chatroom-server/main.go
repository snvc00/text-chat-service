package main

import (
	"bufio"
	"encoding/json"
	"fmt"
	"log"
	"net"
	"net/http"
	"net/rpc"
	"os"

	"github.com/gorilla/websocket"
)

type ChatServer struct {
	Title       string `json:"title"`
	UsersCount  uint64 `json:"usersCount"`
	Host        string `json:"host"`
	Image       string `json:"image"`
	Description string `json:"description"`
}

type Message struct {
	Sender  map[string]string `json:"sender"`
	Message string            `json:"message"`
	At      string            `json:"at"`
}

var chatServer ChatServer
var messages []Message
var upgrader = websocket.Upgrader{}
var clients map[uint64]*websocket.Conn
var nextId uint64

func (chatServer *ChatServer) Information(args int, reply *ChatServer) error {
	chatServer.UsersCount = uint64(len(clients))
	*reply = *chatServer

	return nil
}

func sendMessages() {
	messagesJson, _ := json.Marshal(messages)
	for _, ws := range clients {
		_ = ws.WriteMessage(1, messagesJson)
	}
}

func registerNewClient(ws *websocket.Conn) uint64 {
	id := nextId
	clients[id] = ws
	nextId++

	return id
}

func HandleClientConnection(res http.ResponseWriter, req *http.Request) {
	upgrader.CheckOrigin = func(r *http.Request) bool { return true }

	switch req.Method {
	case "GET":
		ws, _ := upgrader.Upgrade(res, req, nil)
		id := registerNewClient(ws)

		defer ws.Close()

		ws.SetCloseHandler(func(code int, text string) error {
			delete(clients, id)

			return nil
		})

		sendMessages()
		for {
			var nextMessage Message
			if err := ws.ReadJSON(&nextMessage); err != nil {
				fmt.Println(err)
				return
			}

			messages = append(messages, nextMessage)
			sendMessages()
		}
	case "OPTIONS":
		fmt.Fprint(res, "GET, OPTIONS")
	default:
		http.Error(res, "Not implemented method", http.StatusNotImplemented)
	}
}

func newChatServer() ChatServer {
	var host, image string
	scanner := bufio.NewScanner(os.Stdin)

	fmt.Print("Host: ")
	fmt.Scanln(&host)

	fmt.Print("Name: ")
	scanner.Scan()
	serverName := scanner.Text()

	fmt.Print("Description: ")
	scanner.Scan()
	description := scanner.Text()

	fmt.Print("Image: ")
	fmt.Scanln(&image)

	return ChatServer{Title: serverName, UsersCount: 0, Host: host, Image: image, Description: description}
}

func main() {
	chatServer := newChatServer()
	messages = make([]Message, 0)
	clients = make(map[uint64]*websocket.Conn)

	rpc.Register(&chatServer)
	rpc.HandleHTTP()
	http.HandleFunc("/chat", HandleClientConnection)

	listener, err := net.Listen("tcp", chatServer.Host)
	if err != nil {
		log.Fatal(err)
	}

	fmt.Println("Server for", chatServer.Title, "chat room running on", chatServer.Host, "...")
	go http.Serve(listener, nil)

	fmt.Scanln()
}
