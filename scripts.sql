alter table [hr_Document] add [NumberOfDays] int not null default 0;
alter table [hr_Document] drop constraint [UK_hr_Document_EmployeeNumber_DocumentNumber];
alter table [hr_Document] add constraint [UK_hr_Document_EmployeeNumber_DocumentType_DocumentNumber] UNIQUE([EmployeeNumber],[DocumentType],[DocumentNumber]);
update [hr_Document] set [EmployeeName]=x.NameAr,[Department]=x.[Department] FROM [hr_Document] as y JOIN [hr_Employee] as x ON y.[EmployeeNumber]=x.[EmployeeNumber];
insert into [hr_AttendanceSheet] ([Name]) select distinct [AttendanceSheet] from [hr_Employee] WHERE [AttendanceSheet] is not null;
 
