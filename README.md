<p align="center">
  <a href="https://example.com/">
    <img src="/demo/logo.png" alt="Logo" width=250 height=80>
  </a>

  <p align="center">
    Share Youtube Video
    <br>
    <a href="https://reponame/issues/new?template=bug.md">Report bug</a>
    ·
    <a href="https://reponame/issues/new?template=feature.md&labels=feature">Request feature</a>
  </p>
</p>


## Table of contents

- [Table of contents](#table-of-contents)
- [Demo](#demo)
- [Introduction](#introduction)
- [Prerequisites](#prerequisites)
- [Installation \& Configuration](#installation--configuration)
    - [Feature](#feature)
    - [Setup Front end](#setup-front-end)
    - [Setup Back end](#setup-back-end)
- [Database Setup](#database-setup)
- [(BE/FS) Docker Deployment](#befs-docker-deployment)
- [Troubleshooting](#troubleshooting)
- [Copyright and license](#copyright-and-license)

## Demo

![Tên video](./demo/Filmmaker%20Movie%20Production%20Logo.gif)

## Introduction

Youtube Video Sharing App là một ứng dụng web cho phép người dùng đăng ký, đăng nhập, chia sẻ và xem video từ YouTube. Ứng dụng cung cấp 4 chức năng chính là:

- Đăng ký và đăng nhập người dùng: Người dùng có thể tạo tài khoản mới bằng cách đăng ký với tên người dùng và mật khẩu. Sau khi đăng ký, người dùng có thể sử dụng thông tin đăng nhập để đăng nhập vào ứng dụng.

- Chia sẻ video từ YouTube: Người dùng đã đăng nhập có thể chia sẻ video từ YouTube bằng cách nhập URL của video vào ứng dụng. Ứng dụng sẽ lấy thông tin của video, bao gồm tiêu đề và mô tả, và lưu trữ video trong hệ thống. Video được chia sẻ sẽ hiển thị trong danh sách các video đã chia sẻ trong ứng dụng.

- Xem danh sách video đã chia sẻ: Ứng dụng cung cấp một danh sách các video đã được chia sẻ bởi người dùng. Danh sách này hiển thị các thông tin cơ bản về video, chẳng hạn như tiêu đề và tên người dùng đã chia sẻ video. Người dùng có thể nhấp vào một video để xem nó trực tiếp trên trình duyệt.

- Thông báo thời gian thực cho video mới được chia sẻ: Khi một người dùng chia sẻ một video mới, các người dùng khác đã đăng nhập sẽ nhận được thông báo thời gian thực về video mới đã được chia sẻ. Thông báo này có thể hiển thị dưới dạng cửa sổ pop-up hoặc banner trong ứng dụng, và nó sẽ chứa tiêu đề video và tên người dùng đã chia sẻ nó.

## Prerequisites

<h4> Tools </h4>
<img src="https://skillicons.dev/icons?i=git,github,vercel,vscode" alt="tools logos" /><br>

<h4> Languages and Frameworks </h4>
<img src="https://skillicons.dev/icons?i=html,css,js,react,nodejs,express,mongodb,jest" alt="languages logos" /><br><br>

## Installation & Configuration

#### Feature

Key feature: 
- Register
- Login
- Logout
- Realtime notification use Ably (Socket not support in Vercel)
- Realtime video added (No get list video, by because will slow if does not have a partition, only realtime api)

Not implemented yet:

- Mising spinner
- Not validate detail
- Missing Front End Unit Test
- Missing Front End E2E

External API:
- Youtube Data API
- Ably API

Database:
- Mongodb Atlas

#### Setup Front end
Install dependencies
```shell
cd front-end && npm i

# Run
npm start
```

#### Setup Back end
Install dependencies
```shell
cd back-end && npm i

# Run
npm start

# Run Unit test
npm test
```

## Database Setup

Using mongodb Atlas, copy the url and replace it with .env in `back-end` folder

## (BE/FS) Docker Deployment

Not yet

## Troubleshooting

Not yet

## Copyright and license

Not yet