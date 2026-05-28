FROM golang:1.25-alpine AS builder

ENV GOPROXY=https://goproxy.cn,direct

WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download

COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -o /server ./cmd/server

FROM alpine:3.20

WORKDIR /app
COPY --from=builder /server .
COPY migrations/ ./migrations/

ENV PB_DATA_DIR=/pb_data

EXPOSE 8080

CMD ["./server"]
