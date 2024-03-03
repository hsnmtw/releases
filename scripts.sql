alter table [hr_Document]     add [Status]            varchar(30)        not null default 'Pending';
alter table [hr_HRDepartment] add [PendingDocuments]  int                not null default 0;
alter table [hr_Employee]     add [PendingDocuments]  int                not null default 0;