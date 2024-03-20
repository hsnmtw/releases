insert into [common_DomainGroup] ([Name],[FQDN],[IsAuthorized],[Owner]) VALUES ('HR Training','DB=HR Training',1,'salmordy');

update etc_group set [FQDN]=[Name] where [FQDN] is null;
update common_DomainGroup set [FQDN]=[Name] where [FQDN] is null;

alter table etc_group alter column [FQDN] NVARCHAR(255) NOT NULL DEFAULT '!';
alter table common_DomainGroup alter column [FQDN] NVARCHAR(255) NOT NULL DEFAULT '!';