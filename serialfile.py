import socket

def receive_file(server_ip, server_port, output_file_path):
    server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server_socket.bind((server_ip, server_port))
    server_socket.listen(1)
    print(f"Server listening on {server_ip}:{server_port}")

    conn, addr = server_socket.accept()
    print(f"Accepted connection from {addr}")

    with open(output_file_path, 'wb') as f:
        while True:
            data = conn.recv(1024)
            if not data:
                break  # Connection closed, stop the loop
            f.write(data)

    print("File received and saved.")
    conn.close()

if __name__ == "__main__":
    receive_file('192.168.1.16', 5040, 'received_file.wav')
