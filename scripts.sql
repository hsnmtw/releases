alter table [etc_user] add [ExpiryDate] DATETIME NOT NULL DEFAULT '2026-12-31';
alter table [common_User] add [ExpiryDate] DATETIME NOT NULL DEFAULT '2026-12-31';\
update [etc_user] set [ExpiryDate]='2090-12-31' where username in ('habalmutawa','radawood');
update [common_User] set [ExpiryDate]='2090-12-31' where username in ('habalmutawa','radawood');
alter table [etc_user] add constraint UK_etc_user_Username UNIQUE([Username]);
alter table [common_User] add constraint UK_common_User_Username UNIQUE([Username]); 
