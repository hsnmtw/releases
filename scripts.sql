insert into [common_ScheduledTask]
([Name],[Frequency],[Time],[Enabled],[Procedure])
values 
('Daily System Upgrade','Day','04:00',1,'{ClassName:"ui.Helpers.UITaskExecution",Method:"RunUpgrade"}')
;