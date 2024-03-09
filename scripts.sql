alter table [etc_user] add [ExpiryDate] DATETIME NOT NULL DEFAULT '2024-12-31';
alter table [common_User] add [ExpiryDate] DATETIME NOT NULL DEFAULT '2024-12-31';
update [etc_user] set [ExpiryDate]='2090-12-31' where username in ('habalmutawa','radawood','salmordy');
update [common_User] set [ExpiryDate]='2090-12-31' where username in ('habalmutawa','radawood','salmordy');
