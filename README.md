# Hotel Manager — README

## Objetivo

Aplicação para gestão de hóspedes em hotel — reservas, check-in, checkout e cobrança.

---

## Pré-requisitos

* Git
* Java 11 ou superior (recomenda-se Java 17 para Spring Boot 3.x)
* Maven (ou usar o wrapper `./mvnw` fornecido)
* Node.js (recomenda-se Node 16 LTS ou compatível com Angular 14) e npm
* Angular CLI (opcional, `npx @angular/cli@14` funciona)
* Docker (opcional, recomendado para PostgreSQL se desejar rodar localmente em container)
* Navegador moderno (Chrome/Edge) com suporte a headless para testes unitários do frontend

---

## Banco de dados (PostgreSQL)

O projeto backend espera um PostgreSQL com as credenciais (padrão em `src/main/resources/application.properties`):

```
spring.datasource.url=jdbc:postgresql://localhost:5432/hotel
spring.datasource.username=hotel
spring.datasource.password=hotel
```

## Backend — Executando localmente

Entre na pasta do backend e execute via Maven (ou via wrapper):

```bash
cd hotelmanager
./mvnw spring-boot:run
# ou
mvn spring-boot:run
```

A API ficará disponível em `http://localhost:8080` (conforme `application.properties`).

---

## Frontend — Executando localmente

Requisitos: Node e npm. Na pasta `demo-frontend` execute:

```bash
cd demo-frontend
npm install
npm start
```

A aplicação Angular servirá em `http://localhost:4200`.

Se desejar executar com proxy para backend (o projeto já tem `proxy.conf.json`), `npm start` já usa ele no script `start`.

## Testes Unitários

## Contato / Suporte

Para dúvidas sobre a execução da aplicação, verificar endpoints ou problemas de conexão, basta abrir o console do navegador ou o terminal do backend e observar os logs.
