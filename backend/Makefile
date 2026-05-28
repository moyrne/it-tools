BINARY ?= server
BIN_DIR ?= ./bin
DATA_DIR ?= ./pb_data
ENV_FILE ?= ./.env
GOPROXY ?= https://goproxy.cn,direct

.PHONY: all build run build-run clean test deps env

all: build

env:
	@if [ ! -f $(ENV_FILE) ]; then \
		cp .env.example $(ENV_FILE); \
		echo "Created $(ENV_FILE) from .env.example"; \
	else \
		echo "$(ENV_FILE) already exists"; \
	fi

deps:
	GOPROXY=$(GOPROXY) go mod download

build: deps
	GOPROXY=$(GOPROXY) CGO_ENABLED=0 go build -o $(BIN_DIR)/$(BINARY) ./cmd/server

run: build
	./$(BIN_DIR)/$(BINARY) serve

clean:
	rm -rf $(BIN_DIR)
	rm -rf $(DATA_DIR)

test:
	go test ./...

dev:
	GOPROXY=$(GOPROXY) go run ./cmd/server serve
