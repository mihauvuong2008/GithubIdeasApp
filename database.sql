use githubideanodejswebapp;

show tables;

CREATE TABLE IF NOT EXISTS customers (name VARCHAR(255), address VARCHAR(255));
CREATE TABLE IF NOT EXISTS ckeditordata (
	id_doc INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
	doc_name VARCHAR(255) NOT NULL,
	content MEDIUMTEXT,
	link VARCHAR (511),
	creatdate DATETIME
	);

SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE IF NOT EXISTS chatappuser (
	userid INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
	username VARCHAR(255) NOT NULL,
	password VARCHAR(255) NOT NULL,
	login BOOLEAN
	);

CREATE TABLE IF NOT EXISTS friend_relate (
	userid INT NOT NULL,
	friend INT NOT NULL,
    FOREIGN KEY (userid) REFERENCES chatappuser(userid),
    FOREIGN KEY (friend) REFERENCES chatappuser(userid),
    primary key (userid, friend)
	);

CREATE TABLE IF NOT EXISTS chat_group(
	id_group INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
	group_name VARCHAR(511) NOT NULL,
	creator INT NOT NULL,
	datetime_create DATETIME,
    FOREIGN KEY (creator) REFERENCES chatappuser(userid)
	);

CREATE TABLE IF NOT EXISTS member_of_chat_group(
	id_group INT NOT NULL,
	userid INT NOT NULL,
	datetime_join DATETIME,
    FOREIGN KEY (id_group) REFERENCES chat_group(id_group),
    FOREIGN KEY (userid) REFERENCES chatappuser(userid),
    primary key (id_group, userid)
	);

CREATE TABLE IF NOT EXISTS chat_group_message_data(
	id_message INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
	id_group INT,
	sender INT,
	message_data MEDIUMTEXT,
	datetime_send DATETIME,
    FOREIGN KEY (id_group) REFERENCES chat_group(id_group),
    FOREIGN KEY (sender) REFERENCES chatappuser(userid),
    CONSTRAINT member_have_chat_group_ct FOREIGN KEY (id_group, sender)
                        REFERENCES member_of_chat_group(id_group, userid)
);


CREATE TABLE IF NOT EXISTS private_message_data(
	id_message INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
	sender INT,
	receiver INT,
	message_data MEDIUMTEXT,
	datetime_send DATETIME,
    FOREIGN KEY (sender) REFERENCES chatappuser(userid),
    FOREIGN KEY (receiver) REFERENCES chatappuser(userid)
);



INSERT INTO  chatappuser ( username, password , login ) value ('username1', '123456', FALSE);
INSERT INTO  chatappuser ( username, password , login ) value ('username2', '123456', FALSE);
INSERT INTO  chatappuser ( username, password , login ) value ('username3', '123456', FALSE);
INSERT INTO  chatappuser ( username, password , login ) value ('username4', '123456', FALSE);
INSERT INTO  chatappuser ( username, password , login ) value ('username5', '123456', FALSE);
INSERT INTO  chatappuser ( username, password , login ) value ('username6', '123456', FALSE);
INSERT INTO  chatappuser ( username, password , login ) value ('username7', '123456', FALSE);
INSERT INTO  chatappuser ( username, password , login ) value ('username8', '123456', FALSE);
INSERT INTO  chatappuser ( username, password , login ) value ('username9', '123456', FALSE);
INSERT INTO  chatappuser ( username, password , login ) value ('username10', '123456', FALSE);
INSERT INTO  chatappuser ( username, password , login ) value ('username11', '123456', FALSE);
INSERT INTO  chatappuser ( username, password , login ) value ('username12', '123456', FALSE);
INSERT INTO  chatappuser ( username, password , login ) value ('username13', '123456', FALSE);
INSERT INTO  chatappuser ( username, password , login ) value ('username14', '123456', FALSE);
INSERT INTO  chatappuser ( username, password , login ) value ('username15', '123456', FALSE);


INSERT INTO  friend_relate ( userid, friend) value ('1', '2');
INSERT INTO  friend_relate ( userid, friend) value ('2', '2');
INSERT INTO  friend_relate ( userid, friend) value ('3', '2');
INSERT INTO  friend_relate ( userid, friend) value ('4', '2');
INSERT INTO  friend_relate ( userid, friend) value ('5', '2');
INSERT INTO  friend_relate ( userid, friend) value ('6', '2');
INSERT INTO  friend_relate ( userid, friend) value ('7', '2');
INSERT INTO  friend_relate ( userid, friend) value ('1', '3');
INSERT INTO  friend_relate ( userid, friend) value ('2', '3');
INSERT INTO  friend_relate ( userid, friend) value ('3', '3');
INSERT INTO  friend_relate ( userid, friend) value ('4', '3');
INSERT INTO  friend_relate ( userid, friend) value ('5', '3');
INSERT INTO  friend_relate ( userid, friend) value ('6', '3');
INSERT INTO  friend_relate ( userid, friend) value ('7', '3');
INSERT INTO  friend_relate ( userid, friend) value ('1', '4');
INSERT INTO  friend_relate ( userid, friend) value ('2', '4');
INSERT INTO  friend_relate ( userid, friend) value ('3', '4');
INSERT INTO  friend_relate ( userid, friend) value ('4', '4');
INSERT INTO  friend_relate ( userid, friend) value ('5', '4');
INSERT INTO  friend_relate ( userid, friend) value ('6', '4');
INSERT INTO  friend_relate ( userid, friend) value ('7', '4');
INSERT INTO  friend_relate ( userid, friend) value ('1', '5');
INSERT INTO  friend_relate ( userid, friend) value ('2', '5');
INSERT INTO  friend_relate ( userid, friend) value ('3', '5');
INSERT INTO  friend_relate ( userid, friend) value ('1', '8');
INSERT INTO  friend_relate ( userid, friend) value ('1', '9');
INSERT INTO  friend_relate ( userid, friend) value ('1', '10');
INSERT INTO  friend_relate ( userid, friend) value ('1', '11');
INSERT INTO  friend_relate ( userid, friend) value ('1', '12');
INSERT INTO  friend_relate ( userid, friend) value ('1', '13');
INSERT INTO  friend_relate ( userid, friend) value ('1', '14');


INSERT INTO  chat_group (  group_name, creator, datetime_create) value ( 'group name1', '1', '2021-03-02 08:08:49');
INSERT INTO  chat_group (  group_name, creator, datetime_create) value ('group name2', '1', '2021-03-02 07:08:49');
INSERT INTO  chat_group (  group_name, creator, datetime_create) value ( 'group name3', '1', '2021-03-02 09:08:49');
INSERT INTO  chat_group (  group_name, creator, datetime_create) value ( 'group name4', '1', '2021-03-02 05:08:49');
INSERT INTO  chat_group (  group_name, creator, datetime_create) value ( 'group name5', '2', '2021-03-02 06:08:49');
INSERT INTO  chat_group (  group_name, creator, datetime_create) value ( 'group name6', '2', '2021-03-02 04:08:49');
INSERT INTO  chat_group (  group_name, creator, datetime_create) value ( 'group name7', '2', '2021-03-02 06:08:49');
INSERT INTO  chat_group (  group_name, creator, datetime_create) value ('group name8', '3', '2021-03-02 04:08:49');


INSERT INTO  member_of_chat_group (id_group, userid, datetime_join) value ( '1', '1', '2021-03-02 08:08:49');
INSERT INTO  member_of_chat_group (id_group, userid, datetime_join) value ( '1', '2', '2021-03-02 08:08:49');
INSERT INTO  member_of_chat_group (id_group, userid, datetime_join) value ( '1', '3', '2021-03-02 08:08:49');
INSERT INTO  member_of_chat_group (id_group, userid, datetime_join) value ( '1', '4', '2021-03-02 08:08:49');
INSERT INTO  member_of_chat_group (id_group, userid, datetime_join) value ( '4', '3', '2021-03-02 08:08:49');
INSERT INTO  member_of_chat_group (id_group, userid, datetime_join) value ( '4', '5', '2021-03-02 08:08:49');
INSERT INTO  member_of_chat_group (id_group, userid, datetime_join) value ( '2', '1', '2021-03-02 08:08:49');
INSERT INTO  member_of_chat_group (id_group, userid, datetime_join) value ( '3', '1', '2021-03-02 08:08:49');
INSERT INTO  member_of_chat_group (id_group, userid, datetime_join) value ( '4', '1', '2021-03-02 08:08:49');
INSERT INTO  member_of_chat_group (id_group, userid, datetime_join) value ( '5', '1', '2021-03-02 08:08:49');
INSERT INTO  member_of_chat_group (id_group, userid, datetime_join) value ( '6', '1', '2021-03-02 08:08:49');
INSERT INTO  member_of_chat_group (id_group, userid, datetime_join) value ( '2', '2', '2021-03-02 08:08:49');
INSERT INTO  member_of_chat_group (id_group, userid, datetime_join) value ( '3', '2', '2021-03-02 08:08:49');
INSERT INTO  member_of_chat_group (id_group, userid, datetime_join) value ( '4', '2', '2021-03-02 08:08:49');
INSERT INTO  member_of_chat_group (id_group, userid, datetime_join) value ( '5', '2', '2021-03-02 08:08:49');
INSERT INTO  member_of_chat_group (id_group, userid, datetime_join) value ( '6', '2', '2021-03-02 08:08:49');
INSERT INTO  member_of_chat_group (id_group, userid, datetime_join) value ( '2', '3', '2021-03-02 08:08:49');
INSERT INTO  member_of_chat_group (id_group, userid, datetime_join) value ( '3', '3', '2021-03-02 08:08:49');
INSERT INTO  member_of_chat_group (id_group, userid, datetime_join) value ( '4', '3', '2021-03-02 08:08:49');
INSERT INTO  member_of_chat_group (id_group, userid, datetime_join) value ( '5', '3', '2021-03-02 08:08:49');
INSERT INTO  member_of_chat_group (id_group, userid, datetime_join) value ( '6', '3', '2021-03-02 08:08:49');


INSERT INTO  chat_group_message_data (id_group, sender, message_data,datetime_send) value ( '1', '1', 'bla bla bla bla ' ,'2021-03-02 08:08:49');
INSERT INTO  chat_group_message_data (id_group, sender, message_data,datetime_send) value ( '1', '2', 'bla bla bla bla ' ,'2021-03-02 08:08:49');
INSERT INTO  chat_group_message_data (id_group, sender, message_data,datetime_send) value ( '1', '1', 'bla bla bla bla ' ,'2021-03-02 08:08:49');
INSERT INTO  chat_group_message_data (id_group, sender, message_data,datetime_send) value ( '1', '2', 'bla bla bla bla ' ,'2021-03-02 08:08:49');
INSERT INTO  chat_group_message_data (id_group, sender, message_data,datetime_send) value ( '1', '1', 'bla bla bla bla ' ,'2021-03-02 08:08:49');
INSERT INTO  chat_group_message_data (id_group, sender, message_data,datetime_send) value ( '1', '3', 'bla bla bla bla ' ,'2021-03-02 08:08:49');
INSERT INTO  chat_group_message_data (id_group, sender, message_data,datetime_send) value ( '1', '2', 'bla bla bla bla ' ,'2021-03-02 08:08:49');
INSERT INTO  chat_group_message_data (id_group, sender, message_data,datetime_send) value ( '2', '1', 'bla bla bla bla ' ,'2021-03-02 08:08:49');
INSERT INTO  chat_group_message_data (id_group, sender, message_data,datetime_send) value ( '2', '1', 'bla bla bla bla ' ,'2021-03-02 08:08:49');
INSERT INTO  chat_group_message_data (id_group, sender, message_data,datetime_send) value ( '2', '1', 'bla bla bla bla ' ,'2021-03-02 08:08:49');




delete from private_message_data;
delete from chat_group_message_data;
delete from member_of_chat_group;
delete from chat_group;
delete from friend_relate;
delete from chatappuser;



drop table private_message_data;
drop table chat_group_message_data;
drop table member_of_chat_group;
drop table chat_group;
drop table friend_relate;
drop table chatappuser;



INSERT INTO  ckeditordata ( doc_name, content , creatdate ) value ('name1', 'data1', '2021-03-02 08:08:49');


drop table customers;
drop table ckeditordata;
