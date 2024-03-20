insert into [etc_group] ([Name],[FQDN]) VALUES ('HR Training','DB=HR Training');
insert into [eServices_Authorization] ([Code],[NameEn],[NameAr]) VALUES ('HRTR','HR Training','الموارد البشرية - شئون التدريب');
insert into [eServices_AuthorizationDomainGroup] ([AuthorizationId],[GroupName]) VALUES ((SELECT MAX([Id]) FROM [eServices_Authorization] WHERE [Code]='HRTR'),'HR Training');
insert into [eServices_Role] ([Area],[Controller],[Action],[Name]) VALUES ('ePolicy','Trainee','Index','/ePolicy/Trainee/Index');
insert into [eServices_Role] ([Area],[Controller],[Action],[Name]) VALUES ('ePolicy','Trainee','Form','/ePolicy/Trainee/Form');
insert into [eServices_Role] ([Area],[Controller],[Action],[Name]) VALUES ('ePolicy','Trainee','Save','/ePolicy/Trainee/Save');
insert into [eServices_AuthorizationRole] ([AuthorizationId],[RoleId]) ((SELECT MAX([Id]) FROM [eServices_Authorization] WHERE [Code]='HRTR'),(SELECT MAX([Id]) FROM [eServices_Role] WHERE [Name]='/ePolicy/Trainee/Index'))
insert into [eServices_AuthorizationRole] ([AuthorizationId],[RoleId]) ((SELECT MAX([Id]) FROM [eServices_Authorization] WHERE [Code]='HRTR'),(SELECT MAX([Id]) FROM [eServices_Role] WHERE [Name]='/ePolicy/Trainee/Form'))
insert into [eServices_AuthorizationRole] ([AuthorizationId],[RoleId]) ((SELECT MAX([Id]) FROM [eServices_Authorization] WHERE [Code]='HRTR'),(SELECT MAX([Id]) FROM [eServices_Role] WHERE [Name]='/ePolicy/Trainee/Save'))
insert into [eServices_AuthorizationRole] ([AuthorizationId],[RoleId]) ((SELECT MAX([Id]) FROM [eServices_Authorization] WHERE [Code]='HRMGR'),(SELECT MAX([Id]) FROM [eServices_Role] WHERE [Name]='/ePolicy/Trainee/Index'))
insert into [eServices_AuthorizationRole] ([AuthorizationId],[RoleId]) ((SELECT MAX([Id]) FROM [eServices_Authorization] WHERE [Code]='HRMGR'),(SELECT MAX([Id]) FROM [eServices_Role] WHERE [Name]='/ePolicy/Trainee/Form'))
insert into [eServices_AuthorizationRole] ([AuthorizationId],[RoleId]) ((SELECT MAX([Id]) FROM [eServices_Authorization] WHERE [Code]='HRMGR'),(SELECT MAX([Id]) FROM [eServices_Role] WHERE [Name]='/ePolicy/Trainee/Save'))
insert into [eServices_AuthorizationRole] ([AuthorizationId],[RoleId]) ((SELECT MAX([Id]) FROM [eServices_Authorization] WHERE [Code]='HRSPV'),(SELECT MAX([Id]) FROM [eServices_Role] WHERE [Name]='/ePolicy/Trainee/Index'))
insert into [eServices_AuthorizationRole] ([AuthorizationId],[RoleId]) ((SELECT MAX([Id]) FROM [eServices_Authorization] WHERE [Code]='HRSPV'),(SELECT MAX([Id]) FROM [eServices_Role] WHERE [Name]='/ePolicy/Trainee/Form'))
insert into [eServices_AuthorizationRole] ([AuthorizationId],[RoleId]) ((SELECT MAX([Id]) FROM [eServices_Authorization] WHERE [Code]='HRSPV'),(SELECT MAX([Id]) FROM [eServices_Role] WHERE [Name]='/ePolicy/Trainee/Save'))
alter table [hr_Employee] alter column [AssignmentType] NVARCHAR(60);
alter table [hr_Employee] alter column [Department] NVARCHAR(300) not null default '!';
alter table [hr_HRDepartment] alter column [Name] NVARCHAR(300) not null default '!';