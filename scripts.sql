insert into [eServices_AuthorizationArea] ([Area],[AuthorizationId]) select 'HR',[Id] FROM [eServices_Authorization] WHERE [NameEn]='Everyone';