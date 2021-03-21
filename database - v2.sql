
	
use githubideanodejswebapp;


//=============DROP==============
	
use githubideanodejswebapp;


delete from unread_group;
delete from say_to_group;
delete from say_to_friend;
delete from unknow_story;
delete from make_storytrend;
delete from build_story;
delete from part_of_real;
delete from member_of_chat_group;
delete from chat_group;
delete from unhide_usermind;
delete from friend_relate;
delete from chatappuser;

drop table unread_group;
drop table say_to_group;
drop table say_to_friend;
drop table unknow_story;
drop table make_storytrend;
drop table build_story;
drop table part_of_real;
drop table member_of_chat_group;
drop table chat_group;
drop table unhide_usermind;
drop table friend_relate;
drop table chatappuser;
//==========================================

show tables;



SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE IF NOT EXISTS chatappuser (
	userid INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
	username VARCHAR(255) NOT NULL,
	password VARCHAR(255) NOT NULL,
	lastdatetimelogin  DATETIME,
	availabletoken VARCHAR(2047) NOT NULL,
	login BOOLEAN
);

CREATE TABLE IF NOT EXISTS friend_relate (
	userid INT NOT NULL,
	friend INT NOT NULL,
	datetime_makefriend  DATETIME,
    FOREIGN KEY (userid) REFERENCES chatappuser(userid),
    FOREIGN KEY (friend) REFERENCES chatappuser(userid),
    primary key (userid, friend)
);

CREATE TABLE IF NOT EXISTS unhide_usermind (
	unhide_usermindid INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
	userid INT NOT NULL,
	message_data MEDIUMTEXT,
	datetime_unhide DATETIME,
    FOREIGN KEY (userid) REFERENCES chatappuser (userid)
);

CREATE TABLE IF NOT EXISTS chat_group(
	groupid INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
	group_name VARCHAR(511) NOT NULL,
	creator INT NOT NULL,
	datetime_create DATETIME,
    FOREIGN KEY (creator) REFERENCES chatappuser(userid)
);

CREATE TABLE IF NOT EXISTS member_of_chat_group(
	groupid INT NOT NULL,
	userid INT NOT NULL,
	datetime_join DATETIME,
    FOREIGN KEY (groupid) REFERENCES chat_group(groupid),
    FOREIGN KEY (userid) REFERENCES chatappuser(userid),
    primary key (groupid, userid)
);

CREATE TABLE IF NOT EXISTS part_of_real (
	part_of_realid INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
	datetime_split DATETIME
);

CREATE TABLE IF NOT EXISTS build_story (
	userid INT NOT NULL,
	unhide_usermindid INT,
	part_of_realid INT NOT NULL,
	datetime_join DATETIME,
	FOREIGN KEY (userid) REFERENCES chatappuser (userid),
	FOREIGN KEY (unhide_usermindid) REFERENCES unhide_usermind(unhide_usermindid),
	FOREIGN KEY (part_of_realid) REFERENCES part_of_real (part_of_realid),
	PRIMARY KEY (userid, unhide_usermindid, part_of_realid)
);


CREATE TABLE IF NOT EXISTS make_storytrend (
	maketter INT NOT NULL,
	sheep INT NOT NULL,
	storyid INT NOT NULL,
	datetime_maketrend DATETIME,
	FOREIGN KEY (maketter) REFERENCES chatappuser(userid),
	FOREIGN KEY (sheep) REFERENCES chatappuser(userid),
	FOREIGN KEY (storyid) REFERENCES part_of_real(part_of_realid),
	PRIMARY KEY (maketter, sheep, storyid)
);

CREATE TABLE IF NOT EXISTS unknow_story (
	userid INT NOT NULL,
	part_of_realid INT NOT NULL,
	datetime_read DATETIME,
	FOREIGN KEY (userid) REFERENCES chatappuser(userid),
	FOREIGN KEY (part_of_realid) REFERENCES part_of_real(part_of_realid),
	PRIMARY KEY (userid, part_of_realid)
);

CREATE TABLE IF NOT EXISTS say_to_friend (
	receiverid INT NOT NULL,
	unhide_usermindid INT NOT NULL,
	datetime_tell DATETIME,
	datetime_read DATETIME,
	FOREIGN KEY (unhide_usermindid) REFERENCES unhide_usermind(unhide_usermindid),
	FOREIGN KEY (receiverid) REFERENCES chatappuser(userid),
	PRIMARY KEY (receiverid, unhide_usermindid)
);

CREATE TABLE IF NOT EXISTS say_to_group (
	tellerid INT NOT NULL,
	unhide_usermindid INT NOT NULL,
	groupid INT NOT NULL,
	datetime_tell DATETIME,
	FOREIGN KEY (tellerid) REFERENCES chatappuser(userid),
	FOREIGN KEY (unhide_usermindid) REFERENCES unhide_usermind(unhide_usermindid),
	FOREIGN KEY (groupid) REFERENCES chat_group(groupid),
	FOREIGN KEY (groupid, tellerid) REFERENCES member_of_chat_group (groupid, userid),
	PRIMARY KEY (tellerid, unhide_usermindid)
);

CREATE TABLE IF NOT EXISTS unread_group (
	readerid INT NOT NULL,
	unhide_usermindid INT NOT NULL,
	groupid INT NOT NULL,
	datetime_read DATETIME,
	FOREIGN KEY (readerid) REFERENCES chatappuser(userid),
	FOREIGN KEY (unhide_usermindid) REFERENCES unhide_usermind(unhide_usermindid),
	FOREIGN KEY (groupid) REFERENCES chat_group(groupid),
	FOREIGN KEY (groupid, readerid) REFERENCES member_of_chat_group (groupid, userid),
	PRIMARY KEY (readerid, unhide_usermindid)
);


use githubideanodejswebapp;

select c.unhide_usermindid, c.userid, c.message_data, c.datetime_unhide, ca.username, ca.login
    FROM unhide_usermind c, member_of_chat_group m, chatappuser ca, chat_group cg, say_to_group s
    WHERE (c.userid = ca.userid AND c.userid = s.tellerid AND s.unhide_usermindid = c.unhide_usermindid  AND s.groupid = cg.groupid AND m.groupid = cg.groupid AND cg.groupid ='1' AND m.userid = '1')
    ORDER BY c.datetime_unhide  DESC, c.unhide_usermindid DESC limit 30;

select distinct a.unhide_usermindid, a.userid, a.message_data, a.datetime_unhide, a.username, a.login, u.datetime_read,u.readerid  FROM (select c.unhide_usermindid, c.userid, c.message_data, c.datetime_unhide, ca.username, ca.login 
FROM unhide_usermind c, member_of_chat_group m, chatappuser ca, chat_group cg, say_to_group s  
WHERE (c.userid = ca.userid AND c.userid = s.tellerid AND s.unhide_usermindid = c.unhide_usermindid  AND s.groupid = cg.groupid AND m.groupid = cg.groupid AND cg.groupid ='1' AND m.userid = '1') 
ORDER BY c.datetime_unhide  DESC, c.unhide_usermindid DESC) a
LEFT JOIN unread_group u ON u.readerid='1' AND (u.unhide_usermindid = a.unhide_usermindid OR u.unhide_usermindid is NULL) ORDER BY a.unhide_usermindid DESC LIMIT 30;


select count(groupid) from (select  u.readerid, c.unhide_usermindid, c.userid, c.message_data, c.datetime_unhide, ca.username, ca.login, u.groupid 
FROM unhide_usermind c, unread_group u, chatappuser ca 
WHERE c.userid = ca.userid AND u.unhide_usermindid = c.unhide_usermindid AND u.datetime_read is NULL AND u.readerid = '1' ORDER BY c.datetime_unhide ASC, c.unhide_usermindid ASC  LIMIT 100) a,
(
) b WHERE a.groupid = b.groupid;

select distinct groupid from (select  u.readerid, c.unhide_usermindid, c.userid, c.message_data, c.datetime_unhide, ca.username, ca.login, u.groupid 
FROM unhide_usermind c, unread_group u, chatappuser ca 
WHERE c.userid = ca.userid AND u.unhide_usermindid = c.unhide_usermindid AND u.datetime_read is NULL AND u.readerid = '1' ORDER BY c.datetime_unhide ASC, c.unhide_usermindid ASC  LIMIT 100) z

select count(groupid), groupid from (select  u.readerid, c.unhide_usermindid, c.userid, c.message_data, c.datetime_unhide, ca.username, ca.login, u.groupid 
FROM unhide_usermind c, unread_group u, chatappuser ca 
WHERE c.userid = ca.userid AND u.unhide_usermindid = c.unhide_usermindid AND u.datetime_read is NULL AND u.readerid = '1' ORDER BY c.datetime_unhide ASC, c.unhide_usermindid ASC  LIMIT 100) a;

GROUP BY
UNION
//== get notify
select COUNT(u.groupid), u.groupid 
FROM unhide_usermind c, unread_group u, chatappuser ca 
WHERE c.userid = ca.userid AND u.unhide_usermindid = c.unhide_usermindid AND u.datetime_read is NULL AND u.readerid = '1' GROUP BY u.groupid ORDER BY c.datetime_unhide ASC, c.unhide_usermindid ASC  LIMIT 100


INSERT INTO  chatappuser ( username, password ,availabletoken, login ) value ('username1', '123456', '', FALSE);
INSERT INTO  chatappuser ( username, password ,availabletoken, login ) value ('username2', '123456', '', FALSE);
INSERT INTO  chatappuser ( username, password ,availabletoken, login ) value ('username3', '123456', '', FALSE);
INSERT INTO  chatappuser ( username, password ,availabletoken, login ) value ('username4', '123456', '', FALSE);
INSERT INTO  chatappuser ( username, password ,availabletoken, login ) value ('username5', '123456', '', FALSE);
INSERT INTO  chatappuser ( username, password ,availabletoken, login ) value ('username6', '123456', '', FALSE);
INSERT INTO  chatappuser ( username, password ,availabletoken, login ) value ('username7', '123456', '', FALSE);
INSERT INTO  chatappuser ( username, password ,availabletoken, login ) value ('username8', '123456', '', FALSE);
INSERT INTO  chatappuser ( username, password ,availabletoken, login ) value ('username9', '123456', '', FALSE);
INSERT INTO  chatappuser ( username, password ,availabletoken, login ) value ('username10', '123456', '', FALSE);
INSERT INTO  chatappuser ( username, password ,availabletoken, login ) value ('username11', '123456', '', FALSE);
INSERT INTO  chatappuser ( username, password ,availabletoken, login ) value ('username12', '123456', '', FALSE);
INSERT INTO  chatappuser ( username, password ,availabletoken, login ) value ('username13', '123456', '', FALSE);
INSERT INTO  chatappuser ( username, password ,availabletoken, login ) value ('username14', '123456', '', FALSE);
INSERT INTO  chatappuser ( username, password ,availabletoken, login ) value ('username15', '123456', '', FALSE);
INSERT INTO  chatappuser ( username, password ,availabletoken, login ) value ('username16', '123456', '', FALSE);
INSERT INTO  chatappuser ( username, password ,availabletoken, login ) value ('username17', '123456', '', FALSE);
INSERT INTO  chatappuser ( username, password ,availabletoken, login ) value ('username18', '123456', '', FALSE);
INSERT INTO  chatappuser ( username, password ,availabletoken, login ) value ('username19', '123456', '', FALSE);
INSERT INTO  chatappuser ( username, password ,availabletoken, login ) value ('username20', '123456', '', FALSE);
INSERT INTO  chatappuser ( username, password ,availabletoken, login ) value ('username21', '123456', '', FALSE);
INSERT INTO  chatappuser ( username, password ,availabletoken, login ) value ('username22', '123456', '', FALSE);
INSERT INTO  chatappuser ( username, password ,availabletoken, login ) value ('username23', '123456', '', FALSE);
INSERT INTO  chatappuser ( username, password ,availabletoken, login ) value ('username24', '123456', '', FALSE);
INSERT INTO  chatappuser ( username, password ,availabletoken, login ) value ('username25', '123456', '', FALSE);
INSERT INTO  chatappuser ( username, password ,availabletoken, login ) value ('username26', '123456', '', FALSE);


INSERT INTO  friend_relate ( userid, friend, datetime_makefriend) value ('1', '2', '2021-03-02 08:08:49');
INSERT INTO  friend_relate ( userid, friend, datetime_makefriend) value ('2', '3', '2021-03-02 08:08:49');
INSERT INTO  friend_relate ( userid, friend, datetime_makefriend) value ('3', '4', '2021-03-02 08:08:49');
INSERT INTO  friend_relate ( userid, friend, datetime_makefriend) value ('4', '5', '2021-03-02 08:08:49');
INSERT INTO  friend_relate ( userid, friend, datetime_makefriend) value ('5', '6', '2021-03-02 08:08:49');
INSERT INTO  friend_relate ( userid, friend, datetime_makefriend) value ('5', '7', '2021-03-02 08:08:49');
INSERT INTO  friend_relate ( userid, friend, datetime_makefriend) value ('7', '8', '2021-03-02 08:08:49');
INSERT INTO  friend_relate ( userid, friend, datetime_makefriend) value ('8', '9', '2021-03-02 08:08:49');
INSERT INTO  friend_relate ( userid, friend, datetime_makefriend) value ('9', '10', '2021-03-02 08:08:49');
INSERT INTO  friend_relate ( userid, friend, datetime_makefriend) value ('10', '1', '2021-03-02 08:08:49');
INSERT INTO  friend_relate ( userid, friend, datetime_makefriend) value ('1', '3', '2021-03-02 08:08:49');
INSERT INTO  friend_relate ( userid, friend, datetime_makefriend) value ('2', '4', '2021-03-02 08:08:49');
INSERT INTO  friend_relate ( userid, friend, datetime_makefriend) value ('3', '5', '2021-03-02 08:08:49');
INSERT INTO  friend_relate ( userid, friend, datetime_makefriend) value ('4', '6', '2021-03-02 08:08:49');
INSERT INTO  friend_relate ( userid, friend, datetime_makefriend) value ('5', '7', '2021-03-02 08:08:49');
INSERT INTO  friend_relate ( userid, friend, datetime_makefriend) value ('6', '8', '2021-03-02 08:08:49');
INSERT INTO  friend_relate ( userid, friend, datetime_makefriend) value ('7', '9', '2021-03-02 08:08:49');
INSERT INTO  friend_relate ( userid, friend, datetime_makefriend) value ('8', '10', '2021-03-02 08:08:49');
INSERT INTO  friend_relate ( userid, friend, datetime_makefriend) value ('9', '1', '2021-03-02 08:08:49');
INSERT INTO  friend_relate ( userid, friend, datetime_makefriend) value ('10', '2', '2021-03-02 08:08:49');
INSERT INTO  friend_relate ( userid, friend, datetime_makefriend) value ('1', '4', '2021-03-02 08:08:49');
INSERT INTO  friend_relate ( userid, friend, datetime_makefriend) value ('1', '5', '2021-03-02 08:08:49');
INSERT INTO  friend_relate ( userid, friend, datetime_makefriend) value ('1', '6', '2021-03-02 08:08:49');
INSERT INTO  friend_relate ( userid, friend, datetime_makefriend) value ('1', '7', '2021-03-02 08:08:49');
INSERT INTO  friend_relate ( userid, friend, datetime_makefriend) value ('1', '8', '2021-03-02 08:08:49');
INSERT INTO  friend_relate ( userid, friend, datetime_makefriend) value ('1', '9', '2021-03-02 08:08:49');
INSERT INTO  friend_relate ( userid, friend, datetime_makefriend) value ('1', '10', '2021-03-02 08:08:49');
INSERT INTO  friend_relate ( userid, friend, datetime_makefriend) value ('1', '11', '2021-03-02 08:08:49');
INSERT INTO  friend_relate ( userid, friend, datetime_makefriend) value ('1', '12', '2021-03-02 08:08:49');
INSERT INTO  friend_relate ( userid, friend, datetime_makefriend) value ('1', '13', '2021-03-02 08:08:49');
INSERT INTO  friend_relate ( userid, friend, datetime_makefriend) value ('1', '14', '2021-03-02 08:08:49');
INSERT INTO  friend_relate ( userid, friend, datetime_makefriend) value ('1', '15', '2021-03-02 08:08:49');
INSERT INTO  friend_relate ( userid, friend, datetime_makefriend) value ('1', '16', '2021-03-02 08:08:49');
INSERT INTO  friend_relate ( userid, friend, datetime_makefriend) value ('1', '17', '2021-03-02 08:08:49');
INSERT INTO  friend_relate ( userid, friend, datetime_makefriend) value ('1', '18', '2021-03-02 08:08:49');
INSERT INTO  friend_relate ( userid, friend, datetime_makefriend) value ('1', '19', '2021-03-02 08:08:49');
INSERT INTO  friend_relate ( userid, friend, datetime_makefriend) value ('1', '20', '2021-03-02 08:08:49');
INSERT INTO  friend_relate ( userid, friend, datetime_makefriend) value ('1', '21', '2021-03-02 08:08:49');
INSERT INTO  friend_relate ( userid, friend, datetime_makefriend) value ('1', '22', '2021-03-02 08:08:49');
INSERT INTO  friend_relate ( userid, friend, datetime_makefriend) value ('2', '4', '2021-03-02 08:08:49');
INSERT INTO  friend_relate ( userid, friend, datetime_makefriend) value ('2', '5', '2021-03-02 08:08:49');
INSERT INTO  friend_relate ( userid, friend, datetime_makefriend) value ('2', '6', '2021-03-02 08:08:49');
INSERT INTO  friend_relate ( userid, friend, datetime_makefriend) value ('2', '7', '2021-03-02 08:08:49');
INSERT INTO  friend_relate ( userid, friend, datetime_makefriend) value ('2', '8', '2021-03-02 08:08:49');
INSERT INTO  friend_relate ( userid, friend, datetime_makefriend) value ('2', '9', '2021-03-02 08:08:49');
INSERT INTO  friend_relate ( userid, friend, datetime_makefriend) value ('2', '10', '2021-03-02 08:08:49');
INSERT INTO  friend_relate ( userid, friend, datetime_makefriend) value ('2', '11', '2021-03-02 08:08:49');
INSERT INTO  friend_relate ( userid, friend, datetime_makefriend) value ('2', '12', '2021-03-02 08:08:49');
INSERT INTO  friend_relate ( userid, friend, datetime_makefriend) value ('2', '13', '2021-03-02 08:08:49');
INSERT INTO  friend_relate ( userid, friend, datetime_makefriend) value ('2', '14', '2021-03-02 08:08:49');
INSERT INTO  friend_relate ( userid, friend, datetime_makefriend) value ('2', '15', '2021-03-02 08:08:49');
INSERT INTO  friend_relate ( userid, friend, datetime_makefriend) value ('2', '16', '2021-03-02 08:08:49');
INSERT INTO  friend_relate ( userid, friend, datetime_makefriend) value ('2', '17', '2021-03-02 08:08:49');
INSERT INTO  friend_relate ( userid, friend, datetime_makefriend) value ('2', '18', '2021-03-02 08:08:49');
INSERT INTO  friend_relate ( userid, friend, datetime_makefriend) value ('2', '18', '2021-03-02 08:08:49');
INSERT INTO  friend_relate ( userid, friend, datetime_makefriend) value ('2', '19', '2021-03-02 08:08:49');
INSERT INTO  friend_relate ( userid, friend, datetime_makefriend) value ('2', '20', '2021-03-02 08:08:49');
INSERT INTO  friend_relate ( userid, friend, datetime_makefriend) value ('2', '21', '2021-03-02 08:08:49');


INSERT INTO  unhide_usermind (userid, message_data, datetime_unhide) value ('1', 'bla bla bla', '2021-03-02 08:08:49');
INSERT INTO  unhide_usermind (userid, message_data, datetime_unhide) value ('1', 'bla bla bla', '2021-03-02 08:08:49');
INSERT INTO  unhide_usermind (userid, message_data, datetime_unhide) value ('1', 'bla bla bla', '2021-03-02 08:08:49');
INSERT INTO  unhide_usermind (userid, message_data, datetime_unhide) value ('1', 'bla bla bla', '2021-03-02 08:08:49');
INSERT INTO  unhide_usermind (userid, message_data, datetime_unhide) value ('1', 'bla bla bla', '2021-03-02 08:08:49');
INSERT INTO  unhide_usermind (userid, message_data, datetime_unhide) value ('1', 'bla bla bla', '2021-03-02 08:08:49');
INSERT INTO  unhide_usermind (userid, message_data, datetime_unhide) value ('1', 'bla bla bla', '2021-03-02 08:08:49');
INSERT INTO  unhide_usermind (userid, message_data, datetime_unhide) value ('1', 'bla bla bla', '2021-03-02 08:08:49');
INSERT INTO  unhide_usermind (userid, message_data, datetime_unhide) value ('1', 'bla bla bla', '2021-03-02 08:08:49');
INSERT INTO  unhide_usermind (userid, message_data, datetime_unhide) value ('1', 'bla bla bla', '2021-03-02 08:08:49');
INSERT INTO  unhide_usermind (userid, message_data, datetime_unhide) value ('1', 'bla bla bla', '2021-03-02 08:08:49');
INSERT INTO  unhide_usermind (userid, message_data, datetime_unhide) value ('1', 'bla bla bla', '2021-03-02 08:08:49');
INSERT INTO  unhide_usermind (userid, message_data, datetime_unhide) value ('1', 'bla bla bla', '2021-03-02 08:08:49');
INSERT INTO  unhide_usermind (userid, message_data, datetime_unhide) value ('1', 'bla bla bla', '2021-03-02 08:08:49');


INSERT INTO  chat_group (group_name, creator, datetime_create) value ( 'group name1', '1', '2021-03-02 08:08:49');
INSERT INTO  chat_group (group_name, creator, datetime_create) value ( 'group name2', '2', '2021-03-02 08:08:49');
INSERT INTO  chat_group (group_name, creator, datetime_create) value ( 'group name3', '3', '2021-03-02 08:08:49');
INSERT INTO  chat_group (group_name, creator, datetime_create) value ( 'group name4', '4', '2021-03-02 08:08:49');
INSERT INTO  chat_group (group_name, creator, datetime_create) value ( 'group name5', '1', '2021-03-02 08:08:49');
INSERT INTO  chat_group (group_name, creator, datetime_create) value ( 'group name6', '2', '2021-03-02 08:08:49');
INSERT INTO  chat_group (group_name, creator, datetime_create) value ( 'group name7', '3', '2021-03-02 08:08:49');
INSERT INTO  chat_group (group_name, creator, datetime_create) value ( 'group name8', '4', '2021-03-02 08:08:49');
INSERT INTO  chat_group (group_name, creator, datetime_create) value ( 'group name9', '1', '2021-03-02 08:08:49');
INSERT INTO  chat_group (group_name, creator, datetime_create) value ( 'group name10', '4', '2021-03-02 08:08:49');
INSERT INTO  chat_group (group_name, creator, datetime_create) value ( 'group name11', '1', '2021-03-02 08:08:49');
INSERT INTO  chat_group (group_name, creator, datetime_create) value ( 'group name12', '1', '2021-03-02 08:08:49');
INSERT INTO  chat_group (group_name, creator, datetime_create) value ( 'group name13', '1', '2021-03-02 08:08:49');
INSERT INTO  chat_group (group_name, creator, datetime_create) value ( 'group name14', '1', '2021-03-02 08:08:49');
INSERT INTO  chat_group (group_name, creator, datetime_create) value ( 'group name15', '1', '2021-03-02 08:08:49');
INSERT INTO  chat_group (group_name, creator, datetime_create) value ( 'group name16', '1', '2021-03-02 08:08:49');
INSERT INTO  chat_group (group_name, creator, datetime_create) value ( 'group name17', '1', '2021-03-02 08:08:49');
INSERT INTO  chat_group (group_name, creator, datetime_create) value ( 'group name18', '1', '2021-03-02 08:08:49');
INSERT INTO  chat_group (group_name, creator, datetime_create) value ( 'group name19', '1', '2021-03-02 08:08:49');
INSERT INTO  chat_group (group_name, creator, datetime_create) value ( 'group name20', '1', '2021-03-02 08:08:49');
INSERT INTO  chat_group (group_name, creator, datetime_create) value ( 'group name21', '1', '2021-03-02 08:08:49');
INSERT INTO  chat_group (group_name, creator, datetime_create) value ( 'group name22', '1', '2021-03-02 08:08:49');
INSERT INTO  chat_group (group_name, creator, datetime_create) value ( 'group name23', '1', '2021-03-02 08:08:49');
INSERT INTO  chat_group (group_name, creator, datetime_create) value ( 'group name24', '1', '2021-03-02 08:08:49');
INSERT INTO  chat_group (group_name, creator, datetime_create) value ( 'group name25', '1', '2021-03-02 08:08:49');
INSERT INTO  chat_group (group_name, creator, datetime_create) value ( 'group name26', '1', '2021-03-02 08:08:49');
INSERT INTO  chat_group (group_name, creator, datetime_create) value ( 'group name27', '1', '2021-03-02 08:08:49');
INSERT INTO  chat_group (group_name, creator, datetime_create) value ( 'group name28', '1', '2021-03-02 08:08:49');
INSERT INTO  chat_group (group_name, creator, datetime_create) value ( 'group name29', '1', '2021-03-02 08:08:49');
INSERT INTO  chat_group (group_name, creator, datetime_create) value ( 'group name30', '1', '2021-03-02 08:08:49');
INSERT INTO  chat_group (group_name, creator, datetime_create) value ( 'group name31', '1', '2021-03-02 08:08:49');
INSERT INTO  chat_group (group_name, creator, datetime_create) value ( 'group name32', '1', '2021-03-02 08:08:49');
INSERT INTO  chat_group (group_name, creator, datetime_create) value ( 'group name33', '1', '2021-03-02 08:08:49');
INSERT INTO  chat_group (group_name, creator, datetime_create) value ( 'group name34', '1', '2021-03-02 08:08:49');
INSERT INTO  chat_group (group_name, creator, datetime_create) value ( 'group name35', '1', '2021-03-02 08:08:49');
INSERT INTO  chat_group (group_name, creator, datetime_create) value ( 'group name36', '1', '2021-03-02 08:08:49');
INSERT INTO  chat_group (group_name, creator, datetime_create) value ( 'group name37', '1', '2021-03-02 08:08:49');
INSERT INTO  chat_group (group_name, creator, datetime_create) value ( 'group name38', '1', '2021-03-02 08:08:49');
INSERT INTO  chat_group (group_name, creator, datetime_create) value ( 'group name39', '1', '2021-03-02 08:08:49');
INSERT INTO  chat_group (group_name, creator, datetime_create) value ( 'group name40', '1', '2021-03-02 08:08:49');


INSERT INTO  member_of_chat_group (groupid, userid, datetime_join) value ( '1', '1', '2021-03-02 08:08:49');
INSERT INTO  member_of_chat_group (groupid, userid, datetime_join) value ( '2', '2', '2021-03-02 08:08:49');
INSERT INTO  member_of_chat_group (groupid, userid, datetime_join) value ( '3', '3', '2021-03-02 08:08:49');
INSERT INTO  member_of_chat_group (groupid, userid, datetime_join) value ( '4', '4', '2021-03-02 08:08:49');
INSERT INTO  member_of_chat_group (groupid, userid, datetime_join) value ( '5', '5', '2021-03-02 08:08:49');
INSERT INTO  member_of_chat_group (groupid, userid, datetime_join) value ( '6', '6', '2021-03-02 08:08:49');
INSERT INTO  member_of_chat_group (groupid, userid, datetime_join) value ( '7', '7', '2021-03-02 08:08:49');
INSERT INTO  member_of_chat_group (groupid, userid, datetime_join) value ( '8', '8', '2021-03-02 08:08:49');
INSERT INTO  member_of_chat_group (groupid, userid, datetime_join) value ( '1', '2', '2021-03-02 08:08:49');
INSERT INTO  member_of_chat_group (groupid, userid, datetime_join) value ( '2', '3', '2021-03-02 08:08:49');
INSERT INTO  member_of_chat_group (groupid, userid, datetime_join) value ( '3', '4', '2021-03-02 08:08:49');
INSERT INTO  member_of_chat_group (groupid, userid, datetime_join) value ( '4', '5', '2021-03-02 08:08:49');
INSERT INTO  member_of_chat_group (groupid, userid, datetime_join) value ( '5', '6', '2021-03-02 08:08:49');
INSERT INTO  member_of_chat_group (groupid, userid, datetime_join) value ( '6', '7', '2021-03-02 08:08:49');
INSERT INTO  member_of_chat_group (groupid, userid, datetime_join) value ( '7', '8', '2021-03-02 08:08:49');
INSERT INTO  member_of_chat_group (groupid, userid, datetime_join) value ( '8', '9', '2021-03-02 08:08:49');
INSERT INTO  member_of_chat_group (groupid, userid, datetime_join) value ( '1', '3', '2021-03-02 08:08:49');
INSERT INTO  member_of_chat_group (groupid, userid, datetime_join) value ( '2', '4', '2021-03-02 08:08:49');
INSERT INTO  member_of_chat_group (groupid, userid, datetime_join) value ( '3', '5', '2021-03-02 08:08:49');
INSERT INTO  member_of_chat_group (groupid, userid, datetime_join) value ( '4', '6', '2021-03-02 08:08:49');
INSERT INTO  member_of_chat_group (groupid, userid, datetime_join) value ( '5', '', '2021-03-02 08:08:49');
INSERT INTO  member_of_chat_group (groupid, userid, datetime_join) value ( '6', '71', '2021-03-02 08:08:49');
INSERT INTO  member_of_chat_group (groupid, userid, datetime_join) value ( '7', '8', '2021-03-02 08:08:49');
INSERT INTO  member_of_chat_group (groupid, userid, datetime_join) value ( '8', '9', '2021-03-02 08:08:49');
INSERT INTO  member_of_chat_group (groupid, userid, datetime_join) value ( '1', '10', '2021-03-02 08:08:49');
INSERT INTO  member_of_chat_group (groupid, userid, datetime_join) value ( '2', '1', '2021-03-02 08:08:49');
INSERT INTO  member_of_chat_group (groupid, userid, datetime_join) value ( '3', '2', '2021-03-02 08:08:49');
INSERT INTO  member_of_chat_group (groupid, userid, datetime_join) value ( '4', '3', '2021-03-02 08:08:49');
INSERT INTO  member_of_chat_group (groupid, userid, datetime_join) value ( '5', '4', '2021-03-02 08:08:49');
INSERT INTO  member_of_chat_group (groupid, userid, datetime_join) value ( '6', '5', '2021-03-02 08:08:49');
INSERT INTO  member_of_chat_group (groupid, userid, datetime_join) value ( '7', '6', '2021-03-02 08:08:49');
INSERT INTO  member_of_chat_group (groupid, userid, datetime_join) value ( '8', '7', '2021-03-02 08:08:49');
INSERT INTO  member_of_chat_group (groupid, userid, datetime_join) value ( '11', '1', '2021-03-02 08:08:49');
INSERT INTO  member_of_chat_group (groupid, userid, datetime_join) value ( '12', '1', '2021-03-02 08:08:49');
INSERT INTO  member_of_chat_group (groupid, userid, datetime_join) value ( '13', '1', '2021-03-02 08:08:49');
INSERT INTO  member_of_chat_group (groupid, userid, datetime_join) value ( '14', '1', '2021-03-02 08:08:49');
INSERT INTO  member_of_chat_group (groupid, userid, datetime_join) value ( '15', '1', '2021-03-02 08:08:49');
INSERT INTO  member_of_chat_group (groupid, userid, datetime_join) value ( '16', '1', '2021-03-02 08:08:49');
INSERT INTO  member_of_chat_group (groupid, userid, datetime_join) value ( '17', '1', '2021-03-02 08:08:49');
INSERT INTO  member_of_chat_group (groupid, userid, datetime_join) value ( '18', '1', '2021-03-02 08:08:49');
INSERT INTO  member_of_chat_group (groupid, userid, datetime_join) value ( '19', '1', '2021-03-02 08:08:49');
INSERT INTO  member_of_chat_group (groupid, userid, datetime_join) value ( '20', '1', '2021-03-02 08:08:49');
INSERT INTO  member_of_chat_group (groupid, userid, datetime_join) value ( '21', '1', '2021-03-02 08:08:49');
INSERT INTO  member_of_chat_group (groupid, userid, datetime_join) value ( '22', '1', '2021-03-02 08:08:49');
INSERT INTO  member_of_chat_group (groupid, userid, datetime_join) value ( '23', '1', '2021-03-02 08:08:49');
INSERT INTO  member_of_chat_group (groupid, userid, datetime_join) value ( '24', '1', '2021-03-02 08:08:49');
INSERT INTO  member_of_chat_group (groupid, userid, datetime_join) value ( '25', '1', '2021-03-02 08:08:49');
INSERT INTO  member_of_chat_group (groupid, userid, datetime_join) value ( '26', '1', '2021-03-02 08:08:49');
INSERT INTO  member_of_chat_group (groupid, userid, datetime_join) value ( '27', '1', '2021-03-02 08:08:49');
INSERT INTO  member_of_chat_group (groupid, userid, datetime_join) value ( '28', '1', '2021-03-02 08:08:49');
INSERT INTO  member_of_chat_group (groupid, userid, datetime_join) value ( '29', '1', '2021-03-02 08:08:49');
INSERT INTO  member_of_chat_group (groupid, userid, datetime_join) value ( '11', '2', '2021-03-02 08:08:49');
INSERT INTO  member_of_chat_group (groupid, userid, datetime_join) value ( '12', '2', '2021-03-02 08:08:49');
INSERT INTO  member_of_chat_group (groupid, userid, datetime_join) value ( '13', '2', '2021-03-02 08:08:49');
INSERT INTO  member_of_chat_group (groupid, userid, datetime_join) value ( '14', '2', '2021-03-02 08:08:49');
INSERT INTO  member_of_chat_group (groupid, userid, datetime_join) value ( '15', '2', '2021-03-02 08:08:49');
INSERT INTO  member_of_chat_group (groupid, userid, datetime_join) value ( '16', '2', '2021-03-02 08:08:49');
INSERT INTO  member_of_chat_group (groupid, userid, datetime_join) value ( '17', '2', '2021-03-02 08:08:49');
INSERT INTO  member_of_chat_group (groupid, userid, datetime_join) value ( '18', '2', '2021-03-02 08:08:49');
INSERT INTO  member_of_chat_group (groupid, userid, datetime_join) value ( '19', '2', '2021-03-02 08:08:49');
INSERT INTO  member_of_chat_group (groupid, userid, datetime_join) value ( '20', '2', '2021-03-02 08:08:49');
INSERT INTO  member_of_chat_group (groupid, userid, datetime_join) value ( '21', '2', '2021-03-02 08:08:49');
INSERT INTO  member_of_chat_group (groupid, userid, datetime_join) value ( '22', '2', '2021-03-02 08:08:49');
INSERT INTO  member_of_chat_group (groupid, userid, datetime_join) value ( '23', '2', '2021-03-02 08:08:49');
INSERT INTO  member_of_chat_group (groupid, userid, datetime_join) value ( '24', '2', '2021-03-02 08:08:49');
INSERT INTO  member_of_chat_group (groupid, userid, datetime_join) value ( '25', '2', '2021-03-02 08:08:49');
INSERT INTO  member_of_chat_group (groupid, userid, datetime_join) value ( '26', '2', '2021-03-02 08:08:49');
INSERT INTO  member_of_chat_group (groupid, userid, datetime_join) value ( '27', '2', '2021-03-02 08:08:49');
INSERT INTO  member_of_chat_group (groupid, userid, datetime_join) value ( '28', '2', '2021-03-02 08:08:49');
INSERT INTO  member_of_chat_group (groupid, userid, datetime_join) value ( '29', '2', '2021-03-02 08:08:49');
INSERT INTO  member_of_chat_group (groupid, userid, datetime_join) value ( '30', '1', '2021-03-02 08:08:49');
INSERT INTO  member_of_chat_group (groupid, userid, datetime_join) value ( '31', '1', '2021-03-02 08:08:49');
INSERT INTO  member_of_chat_group (groupid, userid, datetime_join) value ( '32', '1', '2021-03-02 08:08:49');
INSERT INTO  member_of_chat_group (groupid, userid, datetime_join) value ( '33', '1', '2021-03-02 08:08:49');
INSERT INTO  member_of_chat_group (groupid, userid, datetime_join) value ( '34', '1', '2021-03-02 08:08:49');
INSERT INTO  member_of_chat_group (groupid, userid, datetime_join) value ( '35', '1', '2021-03-02 08:08:49');
INSERT INTO  member_of_chat_group (groupid, userid, datetime_join) value ( '36', '1', '2021-03-02 08:08:49');
INSERT INTO  member_of_chat_group (groupid, userid, datetime_join) value ( '37', '1', '2021-03-02 08:08:49');
INSERT INTO  member_of_chat_group (groupid, userid, datetime_join) value ( '38', '1', '2021-03-02 08:08:49');
INSERT INTO  member_of_chat_group (groupid, userid, datetime_join) value ( '39', '1', '2021-03-02 08:08:49');
INSERT INTO  member_of_chat_group (groupid, userid, datetime_join) value ( '40', '1', '2021-03-02 08:08:49');
INSERT INTO  member_of_chat_group (groupid, userid, datetime_join) value ( '41', '1', '2021-03-02 08:08:49');


INSERT INTO  part_of_real (part_of_realid, datetime_split) value ( '1', '2021-03-02 08:08:49');
INSERT INTO  part_of_real (part_of_realid, datetime_split) value ( '2', '2021-03-02 08:08:49');
INSERT INTO  part_of_real (part_of_realid, datetime_split) value ( '3', '2021-03-02 08:08:49');
INSERT INTO  part_of_real (part_of_realid, datetime_split) value ( '4', '2021-03-02 08:08:49');
INSERT INTO  part_of_real (part_of_realid, datetime_split) value ( '5', '2021-03-02 08:08:49');
INSERT INTO  part_of_real (part_of_realid, datetime_split) value ( '6', '2021-03-02 08:08:49');
INSERT INTO  part_of_real (part_of_realid, datetime_split) value ( '7', '2021-03-02 08:08:49');
INSERT INTO  part_of_real (part_of_realid, datetime_split) value ( '8', '2021-03-02 08:08:49');
INSERT INTO  part_of_real (part_of_realid, datetime_split) value ( '9', '2021-03-02 08:08:49');
INSERT INTO  part_of_real (part_of_realid, datetime_split) value ( '10', '2021-03-02 08:08:49');
INSERT INTO  part_of_real (part_of_realid, datetime_split) value ( '11', '2021-03-02 08:08:49');
INSERT INTO  part_of_real (part_of_realid, datetime_split) value ( '12', '2021-03-02 08:08:49');
INSERT INTO  part_of_real (part_of_realid, datetime_split) value ( '13', '2021-03-02 08:08:49');
INSERT INTO  part_of_real (part_of_realid, datetime_split) value ( '14', '2021-03-02 08:08:49');


INSERT INTO  build_story (userid, unhide_usermindid, part_of_realid, datetime_join) value ( '1', '1', '1', '2021-03-02 08:08:49');
INSERT INTO  build_story (userid, unhide_usermindid, part_of_realid, datetime_join) value ( '2', '2', '1', '2021-03-02 08:08:49');
INSERT INTO  build_story (userid, unhide_usermindid, part_of_realid, datetime_join) value ( '3', '3', '1', '2021-03-02 08:08:49');
INSERT INTO  build_story (userid, unhide_usermindid, part_of_realid, datetime_join) value ( '3', '1', '1', '2021-03-02 08:08:49');
INSERT INTO  build_story (userid, unhide_usermindid, part_of_realid, datetime_join) value ( '2', '1', '1', '2021-03-02 08:08:49');
INSERT INTO  build_story (userid, unhide_usermindid, part_of_realid, datetime_join) value ( '1', '4', '1', '2021-03-02 08:08:49');
INSERT INTO  build_story (userid, unhide_usermindid, part_of_realid, datetime_join) value ( '2', '4', '1', '2021-03-02 08:08:49');
INSERT INTO  build_story (userid, unhide_usermindid, part_of_realid, datetime_join) value ( '3', '4', '1', '2021-03-02 08:08:49');
INSERT INTO  build_story (userid, unhide_usermindid, part_of_realid, datetime_join) value ( '4', '5', '1', '2021-03-02 08:08:49');
INSERT INTO  build_story (userid, unhide_usermindid, part_of_realid, datetime_join) value ( '3', '5', '1', '2021-03-02 08:08:49');
INSERT INTO  build_story (userid, unhide_usermindid, part_of_realid, datetime_join) value ( '2', '5', '1', '2021-03-02 08:08:49');
INSERT INTO  build_story (userid, unhide_usermindid, part_of_realid, datetime_join) value ( '1', '6', '2', '2021-03-02 08:08:49');
INSERT INTO  build_story (userid, unhide_usermindid, part_of_realid, datetime_join) value ( '2', '6', '2', '2021-03-02 08:08:49');
INSERT INTO  build_story (userid, unhide_usermindid, part_of_realid, datetime_join) value ( '3', '8', '2', '2021-03-02 08:08:49');
	

INSERT INTO  make_storytrend (maketter, sheep, storyid) value ( '1', '1', '1');
INSERT INTO  make_storytrend (maketter, sheep, storyid) value ( '1', '2', '1');
INSERT INTO  make_storytrend (maketter, sheep, storyid) value ( '1', '3', '1');
INSERT INTO  make_storytrend (maketter, sheep, storyid) value ( '1', '4', '1');
INSERT INTO  make_storytrend (maketter, sheep, storyid) value ( '1', '5', '1');
INSERT INTO  make_storytrend (maketter, sheep, storyid) value ( '1', '6', '1');
INSERT INTO  make_storytrend (maketter, sheep, storyid) value ( '1', '7', '1');
INSERT INTO  make_storytrend (maketter, sheep, storyid) value ( '1', '8', '1');
INSERT INTO  make_storytrend (maketter, sheep, storyid) value ( '2', '1', '2');
INSERT INTO  make_storytrend (maketter, sheep, storyid) value ( '2', '2', '2');
INSERT INTO  make_storytrend (maketter, sheep, storyid) value ( '2', '3', '2');
INSERT INTO  make_storytrend (maketter, sheep, storyid) value ( '2', '4', '2');
INSERT INTO  make_storytrend (maketter, sheep, storyid) value ( '2', '5', '2');
INSERT INTO  make_storytrend (maketter, sheep, storyid) value ( '2', '6', '2');
INSERT INTO  make_storytrend (maketter, sheep, storyid) value ( '1', '2', '3');
INSERT INTO  make_storytrend (maketter, sheep, storyid) value ( '1', '4', '3');


INSERT INTO  unknow_story (userid, part_of_realid, datetime_read) value (  '1', '1', '2021-03-02 08:08:49');
INSERT INTO  unknow_story (userid, part_of_realid, datetime_read) value (  '2', '1', '2021-03-02 08:08:49');
INSERT INTO  unknow_story (userid, part_of_realid, datetime_read) value (  '3', '1', '2021-03-02 08:08:49');
INSERT INTO  unknow_story (userid, part_of_realid, datetime_read) value (  '1', '2', '2021-03-02 08:08:49');
INSERT INTO  unknow_story (userid, part_of_realid, datetime_read) value (  '2', '2', '2021-03-02 08:08:49');
INSERT INTO  unknow_story (userid, part_of_realid, datetime_read) value (  '3', '2', '2021-03-02 08:08:49');
INSERT INTO  unknow_story (userid, part_of_realid, datetime_read) value (  '4', '3', '2021-03-02 08:08:49');
INSERT INTO  unknow_story (userid, part_of_realid, datetime_read) value (  '5', '3', '2021-03-02 08:08:49');


INSERT INTO  say_to_friend (unhide_usermindid, receiverid, datetime_tell, datetime_read) value (  '1', '1', '2', '2021-03-02 08:08:49', NULL);
INSERT INTO  say_to_friend (unhide_usermindid, receiverid, datetime_tell, datetime_read) value (  '1', '2', '3', '2021-03-02 08:08:49', NULL);
INSERT INTO  say_to_friend (unhide_usermindid, receiverid, datetime_tell, datetime_read) value (  '1', '3', '4', '2021-03-02 08:08:49', NULL);
INSERT INTO  say_to_friend (unhide_usermindid, receiverid, datetime_tell, datetime_read) value (  '1', '4', '5', '2021-03-02 08:08:49', NULL);
INSERT INTO  say_to_friend (unhide_usermindid, receiverid, datetime_tell, datetime_read) value (  '1', '5', '6', '2021-03-02 08:08:49', NULL);
INSERT INTO  say_to_friend (unhide_usermindid, receiverid, datetime_tell, datetime_read) value (  '1', '6', '7', '2021-03-02 08:08:49', NULL);
INSERT INTO  say_to_friend (unhide_usermindid, receiverid, datetime_tell, datetime_read) value (  '1', '7', '8', '2021-03-02 08:08:49', NULL);
INSERT INTO  say_to_friend (unhide_usermindid, receiverid, datetime_tell, datetime_read) value (  '1', '8', '9', '2021-03-02 08:08:49', NULL);
INSERT INTO  say_to_friend (unhide_usermindid, receiverid, datetime_tell, datetime_read) value (  '1', '9', '10', '2021-03-02 08:08:49', NULL);
INSERT INTO  say_to_friend (unhide_usermindid, receiverid, datetime_tell, datetime_read) value (  '1', '10', '2', '2021-03-02 08:08:49', NULL);


INSERT INTO  say_to_group (tellerid, unhide_usermindid, groupid, datetime_tell) value (  '1', '1', '1', '2021-03-02 08:08:49');	
INSERT INTO  say_to_group (tellerid, unhide_usermindid, groupid, datetime_tell) value (  '1', '2', '2', '2021-03-02 08:08:49');	
INSERT INTO  say_to_group (tellerid, unhide_usermindid, groupid, datetime_tell) value (  '1', '3', '1', '2021-03-02 08:08:49');	
INSERT INTO  say_to_group (tellerid, unhide_usermindid, groupid, datetime_tell) value (  '1', '4', '2', '2021-03-02 08:08:49');	
INSERT INTO  say_to_group (tellerid, unhide_usermindid, groupid, datetime_tell) value (  '1', '5', '1', '2021-03-02 08:08:49');	
INSERT INTO  say_to_group (tellerid, unhide_usermindid, groupid, datetime_tell) value (  '1', '6', '2', '2021-03-02 08:08:49');	
INSERT INTO  say_to_group (tellerid, unhide_usermindid, groupid, datetime_tell) value (  '1', '7', '1', '2021-03-02 08:08:49');	
INSERT INTO  say_to_group (tellerid, unhide_usermindid, groupid, datetime_tell) value (  '1', '8', '2', '2021-03-02 08:08:49');	
INSERT INTO  say_to_group (tellerid, unhide_usermindid, groupid, datetime_tell) value (  '1', '9', '1', '2021-03-02 08:08:49');	
INSERT INTO  say_to_group (tellerid, unhide_usermindid, groupid, datetime_tell) value (  '1', '11', '2', '2021-03-02 08:08:49');	
INSERT INTO  say_to_group (tellerid, unhide_usermindid, groupid, datetime_tell) value (  '1', '10', '1', '2021-03-02 08:08:49');	
	
	
INSERT INTO  unread_group (readerid, unhide_usermindid, groupid, datetime_read) value (  '1', '1', '1', '2021-03-02 08:08:49');
INSERT INTO  unread_group (readerid, unhide_usermindid, groupid, datetime_read) value (  '1', '2', '2', '2021-03-02 08:08:49');
INSERT INTO  unread_group (readerid, unhide_usermindid, groupid, datetime_read) value (  '1', '3', '1', '2021-03-02 08:08:49');
INSERT INTO  unread_group (readerid, unhide_usermindid, groupid, datetime_read) value (  '1', '4', '2', '2021-03-02 08:08:49');
INSERT INTO  unread_group (readerid, unhide_usermindid, groupid, datetime_read) value (  '1', '5', '1', '2021-03-02 08:08:49');
INSERT INTO  unread_group (readerid, unhide_usermindid, groupid, datetime_read) value (  '1', '6', '2', '2021-03-02 08:08:49');
INSERT INTO  unread_group (readerid, unhide_usermindid, groupid, datetime_read) value (  '1', '7', '1', '2021-03-02 08:08:49');
INSERT INTO  unread_group (readerid, unhide_usermindid, groupid, datetime_read) value (  '1', '8', '2', '2021-03-02 08:08:49');
INSERT INTO  unread_group (readerid, unhide_usermindid, groupid, datetime_read) value (  '1', '9', '1', '2021-03-02 08:08:49');












//=============DROP==============
	
use githubideanodejswebapp;


delete from unread_group;
delete from say_to_group;
delete from say_to_friend;
delete from unknow_story;
delete from make_storytrend;
delete from build_story;
delete from part_of_real;
delete from member_of_chat_group;
delete from chat_group;
delete from unhide_usermind;
delete from friend_relate;
delete from chatappuser;

drop table unread_group;
drop table say_to_group;
drop table say_to_friend;
drop table unknow_story;
drop table make_storytrend;
drop table build_story;
drop table part_of_real;
drop table member_of_chat_group;
drop table chat_group;
drop table unhide_usermind;
drop table friend_relate;
drop table chatappuser;


///////////////////////=============================
delete from private_message_data;
delete from chat_group_message_data;
delete from member_of_chat_group;
delete from chat_group;
delete from friend_relate;
delete from chatappuser;



drop table  chat_group_message_unread;
drop table private_message_data;
drop table chat_group_message_data;
drop table member_of_chat_group;
drop table chat_group;
drop table friend_relate;
drop table chatappuser;



INSERT INTO  ckeditordata ( doc_name, content , creatdate ) value ('name1', 'data1', '2021-03-02 08:08:49');


drop table customers;
drop table ckeditordata;



CREATE TABLE IF NOT EXISTS customers (name VARCHAR(255), address VARCHAR(255));

CREATE TABLE IF NOT EXISTS ckeditordata (
	id_doc INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
	doc_name VARCHAR(255) NOT NULL,
	content MEDIUMTEXT,
	link VARCHAR (511),
	creatdate DATETIME
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

