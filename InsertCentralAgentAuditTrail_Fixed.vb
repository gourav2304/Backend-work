Public Sub InsertCentralAgentAuditTrail(ByVal AudiTrail As CentralAgentAuditTrailDTO)
    Dim sql = <sql>
INSERT INTO centralagentAuditrail
(agent_id, agentname, updatedby, updatetask, taskfield, oldvalue, newvalue, lastupdatedon, status, errormessage)
VALUES
(@agent_id, @agentname, @updatedby, @updatetask, @taskfield, @oldvalue, @newvalue, @lastupdatedon, @status, @errormessage)
</sql>.Value

    Using dbm = getDbManager()
        dbm.addParameter("@agent_id", AudiTrail.Agent_ID)
        dbm.addParameter("@agentname", AudiTrail.AgentName)
        dbm.addParameter("@updatedby", AudiTrail.UpdatedBy)
        dbm.addParameter("@updatetask", AudiTrail.UpdateTask)
        dbm.addParameter("@taskfield", AudiTrail.TaskField)
        dbm.addParameter("@oldvalue", AudiTrail.OldValue)
        dbm.addParameter("@newvalue", AudiTrail.NewValue)
        dbm.addParameter("@lastupdatedon", AudiTrail.LastUpdatedOn)
        dbm.addParameter("@status", AudiTrail.Status)
        dbm.addParameter("@errormessage", AudiTrail.ErrorMessage)

        dbm.ExecuteDML(sql)
    End Using
End Sub