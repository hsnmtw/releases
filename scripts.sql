sp_rename 'hr_employee.Cabenet','Cabinet','COLUMN';

alter Table [crashcart_cart] alter column [SecurityCode]            VARCHAR(20)      NOT NULL;
alter Table [crashcart_cart] alter column [CurrentSecurityCode]     VARCHAR(20)      ;
alter Table [crashcart_cart] alter column [LastSecurityCode]        VARCHAR(20)      ;
