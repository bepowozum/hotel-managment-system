# Hotel Manager — README

## Objetivo

Aplicação para gestão de hóspedes em hotel — reservas, check-in e checkout.

---

## Pré-requisitos

* Git
* Java 25
* Maven (ou usar o wrapper `./mvnw` fornecido)
* Node.js (v22.20.0) e npm
* Angular CLI (opcional, `npx @angular/cli@14` funciona)
* Docker (recomendado para PostgreSQL se desejar rodar localmente em container)
* Navegador moderno (Chrome/Edge) com suporte a headless para testes unitários do frontend
* Postman

---

## Banco de dados (PostgreSQL)

- Necessário ter o Docker instalado, segue documentação para intalação do Docker: https://docs.docker.com/engine/install/
- Vá no diretório raíz do projeto do back-end e execute o seguite comando: docker compose up -d
- Após rodar o comando do docker, o banco irá subir em um container.
- Acessar o gerenciador de banco de dados que estiver utilizando, Preferência: pgAdmin e rodar as seguintes queries para criação das tabelas:

```bash
CREATE TABLE hospede (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    documento VARCHAR(20) UNIQUE NOT NULL,
    telefone VARCHAR(20) NOT NULL,
    possui_carro BOOLEAN DEFAULT FALSE
);
```

```bash
CREATE TABLE reserva (
    id SERIAL PRIMARY KEY,
    hospede_id INT NOT NULL,
    data_checkin DATE NOT NULL,
    hora_checkin TIME,
    data_checkout DATE,
    hora_checkout TIME,
    status VARCHAR(20) DEFAULT 'RESERVADO',
    valor_total DECIMAL(10,2),
    FOREIGN KEY (hospede_id) REFERENCES hospede(id)
);
```

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

<img width="1910" height="247" alt="Captura de tela 2025-10-15 023017" src="https://github.com/user-attachments/assets/fe037ff1-5129-4d1f-b380-30de8c875e03" />

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

## Funcionamento da Aplicação

Com o banco de dados em Docker ligado e os comandos iniciando nos respectivos diretórios de backend e frontend:

```bash
mvn spring-boot:run
npm start
```

A aplicação estará gerando na porta:

```bash
http://localhost:4200/hospedes
```

A Navegação possui 3 opções marcadas por botões, a de Hóspedes, a de Reservas e a de Cadastro de Hóspede

### Hóspede
* Listagem de todos os Hóspedes Cadastrados no Sistema;
* Filtro de Busca por Nome, Documento ou por Telefone; O filtro retorna vazio caso seja inserido um valor inválido
* A busca retorna os dados principais apenas do Hóspede

<img width="1889" height="936" alt="image" src="https://github.com/user-attachments/assets/f91827b9-4a36-4190-8f07-a6702b955ee8" />

### Cadastro de Hóspede
* Inserir os dados do hóspede, com Nome, Número de Documento e Número de Telefone, Um Check-Box se ele possui um carro;
* Ao clicar em cadastrar, uma segunda seção se abre, permitindo inserir a data de entrada e a data de saída do Hóspede;
* Alerta indica quando o Hóspede foi criado e quando Reserva foi criado.

<img width="1882" height="872" alt="image" src="https://github.com/user-attachments/assets/edfdbc08-1792-40ad-a9b3-e1c684316513" />

### Reservas
* A lista de Reservas apresenta o nome, as datas marcadas de Check-In e de Check-Out;
* Ao clicar em "Selecionar" em Ações, uma aba lateral com todas as informações e detalhes do Hóspede e da Reserva é disposto. Permite realizar o Check-In e o Check-Out com base no Status do hóspede;
* Três STATUS para hóspedes:
    - Reservado: Hóspede criado;
    - Hospedado: Realizado Check-In;
    - Finalizado: Realizado Check-Out;
* Ao confirmar o Check-Out, o campo de Hora de Check-Out, é habilitado para edição. Caso o horário selecionado seja pós 12:00, ele indica a cobrança de uma multa com um alerta visual e um alert antes de confirmar o check-out.

<img width="1882" height="872" alt="image" src="https://github.com/user-attachments/assets/f3fdf8c7-c10a-4924-8e19-ab7801317766" />
<img width="1897" height="935" alt="Captura de tela 2025-10-15 100053" src="https://github.com/user-attachments/assets/58d7b8a9-3979-4e57-b992-52049913eb1d" />
<img width="1898" height="938" alt="Captura de tela 2025-10-15 100102" src="https://github.com/user-attachments/assets/8879615a-ffb0-4d81-b4d1-b0d159857377" />

## Contato / Suporte

Para dúvidas sobre a execução da aplicação, verificar endpoints ou problemas de conexão, basta abrir o console do navegador ou o terminal do backend e observar os logs.
