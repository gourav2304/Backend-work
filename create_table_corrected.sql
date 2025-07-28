-- Drop the existing table if it exists (BE CAREFUL - this will delete data!)
-- DROP TABLE IF EXISTS centralagentAuditrail;

-- Create the table with consistent naming
CREATE TABLE centralagentAuditrail(
    clustering_key INT AUTO_INCREMENT PRIMARY KEY,
    agent_id CHAR(36),
    agentname VARCHAR(255),
    updatedby CHAR(36),
    updatetask VARCHAR(50), 
    taskfield VARCHAR(255),
    oldvalue VARCHAR(50),
    newvalue VARCHAR(50),
    lastupdatedon DATETIME DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50), -- Success / Failed / InProgress
    errormessage VARCHAR(1000)
);

-- Alternative: If you want to keep the original column names, use backticks
CREATE TABLE centralagentAuditrail_original(
    clustering_key INT AUTO_INCREMENT PRIMARY KEY,
    `Agent_ID` CHAR(36),
    `AgentName` VARCHAR(255),
    `UpdatedBy` CHAR(36),
    `UpdateTask` VARCHAR(50), 
    `TaskField` VARCHAR(255),
    `OldValue` VARCHAR(50),
    `NewValue` VARCHAR(50),
    `LastUpdatedOn` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `Status` VARCHAR(50),
    `ErrorMessage` VARCHAR(1000)
);