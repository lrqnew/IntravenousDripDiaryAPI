#设置客户端连接服务器端的编码
SET NAMES UTF8;
#丢弃数据库，如果存在
DROP DATABASE IF EXISTS IDripDiaryDB;
#创建数据库，设置存储的编码
CREATE DATABASE IDripDiaryDB CHARSET=UTF8;
#进入该数据库
USE IDripDiaryDB;
#用户表
CREATE TABLE user(
  userId INT PRIMARY KEY AUTO_INCREMENT,
  userName  VARCHAR(32),
  userPwd VARCHAR(50),
  sex INT,
  email VARCHAR(30),#邮箱
  birthday DATE,
  signs VARCHAR(100), #个性签名
  avatar VARCHAR(128)  #头像
  regTime date,#注册时间
);
#日记表
CREATE TABLE diary(
  dId INT PRIMARY KEY AUTO_INCREMENT,
  dTitle VARCHAR(50), #标题
  dContent TEXT,#内容
  dTag VARCHAR(100),#日记标签
  privacy INT,#隐私  1-公开  0-私密
  writeDate DATE,#发布日期
  userId INT NOT NULL,
  FOREIGN KEY(userId) REFERENCES user(userId)
);
#建议表
CREATE TABLE advice(
  adId INT PRIMARY KEY AUTO_INCREMENT,
  adContent VARCHAR(500),#建议内容,
  adTime DATE#建议日期
);
insert into user values(NULL,'钢铁侠','12345',1,'1406107400@qq.com','2018-10-10','我是钢铁侠',NULL)
