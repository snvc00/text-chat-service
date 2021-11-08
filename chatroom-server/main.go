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

func chatServerFromStdin(host *string) ChatServer {
	var image string
	scanner := bufio.NewScanner(os.Stdin)

	fmt.Print("Name: ")
	scanner.Scan()
	serverName := scanner.Text()

	fmt.Print("Description: ")
	scanner.Scan()
	description := scanner.Text()

	fmt.Print("Image: ")
	fmt.Scanln(&image)

	return ChatServer{Title: serverName, UsersCount: 0, Host: *host, Image: image, Description: description}
}

func chatServerFromTemplate(host *string) ChatServer {
	templates := make([]ChatServer, 4)
	var option int

	templates[0] = ChatServer{Title: "Apex Legends", UsersCount: 0, Host: *host, Image: "https://logodownload.org/wp-content/uploads/2019/02/apex-legends-logo-1.png", Description: "Shooter, Multiplayer, Battle Royal, Rankeds available."}
	templates[1] = ChatServer{Title: "League of Legends", UsersCount: 0, Host: *host, Image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/LoL_icon.svg/2048px-LoL_icon.svg.png", Description: "MOBA, Online, Free to Play, Runs on a Toaster."}
	templates[2] = ChatServer{Title: "Valorant", UsersCount: 0, Host: *host, Image: "https://studio.cults3d.com/4QqRV9kLYYEuw9ur_X3yjQl1sjk=/516x516/https://files.cults3d.com/uploaders/15024335/illustration-file/a86d53e4-2bd9-4a8f-9550-986686c3131a/gi0mAjIh_400x400.png", Description: "I do not know what to say about this game, there are a lot of tryhards, but remember, DO NOT PEEK."}
	templates[3] = ChatServer{Title: "Overwatch", UsersCount: 0, Host: *host, Image: "https://upload.wikimedia.org/wikipedia/commons/5/55/Overwatch_circle_logo.svg", Description: "There is a free version of this game, it is called Paladins."}

	fmt.Println("Select your template (default: Apex Legends)")
	for i, template := range templates {
		fmt.Print(i, ". ", template.Title, "\n")
	}
	fmt.Print("Option: ")
	fmt.Scanln(&option)

	if option >= len(templates) {
		option = 0
	}

	return templates[option]
}

func newChatServer() ChatServer {
	var option int
	var host string

	fmt.Print("1. Use a template\n2. Create new\nOption: ")
	fmt.Scanln(&option)

	fmt.Print("Host: ")
	fmt.Scanln(&host)

	if option == 1 {
		return chatServerFromTemplate(&host)
	} else {
		return chatServerFromStdin(&host)
	}
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
