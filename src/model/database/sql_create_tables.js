module.exports =`
CREATE TABLE IF NOT EXISTS user(
    user_id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    user_fullname VARCHAR(255) NOT NULL,
    user_cpf VARCHAR(25) NOT NULL);

CREATE TABLE IF NOT EXISTS account (
    account_id INT(11) PRIMARY KEY NOT NULL AUTO_INCREMENT,
    account_number VARCHAR(45) NOT NULL,
    account_agency VARCHAR(45) NOT NULL,
    user_id INT NOT NULL,
    account_balance DECIMAL(10,2) NULL,
    account_type VARCHAR(45) NULL,
    CONSTRAINT fk_account_user
    FOREIGN KEY (user_id)
    REFERENCES user (user_id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;

CREATE UNIQUE INDEX user_id_UNIQUE ON account(user_id)  USING BTREE;

CREATE INDEX fk_account_account1_idx ON account(user_id)  USING BTREE;

CREATE TABLE IF NOT EXISTS transaction_type_operation(
transaction_type_operation_id INT(11)PRIMARY KEY  NOT NULL AUTO_INCREMENT,
transaction_type_operation_name VARCHAR(45) NOT NULL)
ENGINE = InnoDB;        

CREATE TABLE IF NOT EXISTS transaction_type (
transaction_type_id INT(11) PRIMARY KEY NOT NULL AUTO_INCREMENT,
transaction_type_name VARCHAR(45) NOT NULL)
ENGINE = InnoDB;        

CREATE TABLE IF NOT EXISTS transactions (
transaction_id INT(11) PRIMARY KEY NOT NULL AUTO_INCREMENT,
transaction_origin VARCHAR(255) NOT NULL,
transaction_destiny VARCHAR(45) NOT NULL,
transaction_type INT NOT NULL,
transaction_value DECIMAL(10,2) NOT NULL,
transaction_value_original DECIMAL(10,2) NULL,
transaction_deposit_fee FLOAT NULL,
transaction_withdrawal_fee FLOAT NULL,
transaction_type_operation INT NULL,
transaction_account INT NOT NULL,
transaction_created_at DATETIME NOT NULL,
transaction_updated_at DATETIME NOT NULL,
CONSTRAINT fk_transactions_operation
  FOREIGN KEY (transaction_type_operation)
  REFERENCES transaction_type_operation(transaction_type_operation_id)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION,
CONSTRAINT fk_transactions_type
  FOREIGN KEY (transaction_type)
  REFERENCES transaction_type(transaction_type_id)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION,
CONSTRAINT fk_transactions_account
  FOREIGN KEY (transaction_account)
  REFERENCES account(account_id)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION)
ENGINE = InnoDB;

CREATE INDEX fk_transactions_operation_idx ON transactions (transaction_type_operation ASC);

CREATE INDEX fk_transactions_type_idx ON transactions (transaction_type ASC);

CREATE INDEX fk_transactions_account_idx ON transactions (transaction_account ASC);

INSERT INTO donus_credit.transaction_type_operation (transaction_type_operation_id, transaction_type_operation_name) VALUES (1, 'deposito');

INSERT INTO donus_credit.transaction_type_operation (transaction_type_operation_id, transaction_type_operation_name) VALUES (2, 'saque');

INSERT INTO donus_credit.transaction_type_operation (transaction_type_operation_id, transaction_type_operation_name) VALUES (3, 'transferencia');

INSERT INTO donus_credit.transaction_type (transaction_type_id, transaction_type_name) VALUES (1, 'entrada');

INSERT INTO donus_credit.transaction_type (transaction_type_id, transaction_type_name) VALUES (2, 'saida');`;