-- sp_rename 'hr_employee.Cabenet','Cabinet','COLUMN';
-- alter Table [crashcart_cart] alter column [SecurityCode]            VARCHAR(20)      NOT NULL;
-- alter Table [crashcart_cart] alter column [CurrentSecurityCode]     VARCHAR(20)      ;
-- alter Table [crashcart_cart] alter column [LastSecurityCode]        VARCHAR(20)      ;

-- insert into [eServices_Role] ([Name],[Area],[Controller],[Action]) SELECT '/HR/EmployeeRequiredTraining/Index','HR','EmployeeRequiredTraining','Index';
-- insert into [eServices_Role] ([Name],[Area],[Controller],[Action]) SELECT '/HR/EmployeeRequiredTraining/Form' ,'HR','EmployeeRequiredTraining','Form' ;
-- insert into [eServices_Role] ([Name],[Area],[Controller],[Action]) SELECT '/HR/EmployeeRequiredTraining/Save' ,'HR','EmployeeRequiredTraining','Save' ;
-- insert into [eServices_AuthorizationRole] ([RoleId],[AuthorizationId]) SELECT (SELECT MAX([eServices_Role].[Id]) FROM [eServices_Role] WHERE [Name]='/HR/EmployeeRequiredTraining/Index'),(SELECT MAX([Id]) FROM [eServices_Authorization] WHERE [Code]='HR');
-- insert into [eServices_AuthorizationRole] ([RoleId],[AuthorizationId]) SELECT (SELECT MAX([eServices_Role].[Id]) FROM [eServices_Role] WHERE [Name]='/HR/EmployeeRequiredTraining/Form'),(SELECT MAX([Id]) FROM [eServices_Authorization] WHERE [Code]='HR');
-- insert into [eServices_AuthorizationRole] ([RoleId],[AuthorizationId]) SELECT (SELECT MAX([eServices_Role].[Id]) FROM [eServices_Role] WHERE [Name]='/HR/EmployeeRequiredTraining/Save'),(SELECT MAX([Id]) FROM [eServices_Authorization] WHERE [Code]='HR');


update [eServices_Role] set [Controller] = 'HRHome' where [Controller] = 'Home' and [Area]='HR';
update [eServices_Role] set [Area] = 'ePolicy' where [Area] = 'HR';