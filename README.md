# Hotel Manager — README

## Objetivo

Aplicação para gestão de hóspedes em hotel — reservas, check-in e checkout.

---

## Pré-requisitos

* Git
* Java 11 ou superior (recomenda-se Java 17 para Spring Boot 3.x)
* Maven (ou usar o wrapper `./mvnw` fornecido)
* Node.js (recomenda-se Node 16 LTS ou compatível com Angular 14) e npm
* Angular CLI (opcional, `npx @angular/cli@14` funciona)
* Docker (recomendado para PostgreSQL se desejar rodar localmente em container)
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

Os testes unitários do backend foram implementados utilizando **JUnit 5** e **Spring Boot Test**, garantindo a verificação dos principais fluxos das controllers e serviços.  
A cobertura foi analisada com **JaCoCo**, com os seguintes resultados:

| Pacote / Módulo                      | Cobertura de Instruções | Missed Instructions | Missed Branches |
|-------------------------------------|--------------------------|---------------------|-----------------|
| `com.hotel.hotelmanager`            | 91%                      | —                   | —               |
| `com.hotel.hotelmanager.controller` | 85%                      | —                   | —               |
| `com.hotel.hotelmanager.model`      | 0%                       | 100% missed         | —               |
| `com.hotel.hotelmanager.exception`  | 0%                       | 100% missed         | —               |
| **Total Geral**                     | **89%**                  | **53 / 491 missed** | **67%**         |

> ℹ️ As camadas **model** e **exception** não possuem testes diretos, pois consistem em classes simples de dados e exceções tratadas pelas controllers.

---

### ▶️ Executando os testes

Para rodar os testes e gerar o relatório de cobertura:

```bash
cd hotelmanager
mvn clean verify
```

O relatório HTML será gerado em:
```bash
target/site/jacoco/index.html
```
## Contato / Suporte

Para dúvidas sobre a execução da aplicação, verificar endpoints ou problemas de conexão, basta abrir o console do navegador ou o terminal do backend e observar os logs.
