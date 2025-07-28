Public Sub InsertCentralAgentAuditTrail(ByVal AudiTrail As CentralAgentAuditTrailDTO)
    Dim sql = <sql>
INSERT INTO centralagentAuditrail
(`Agent_ID`, `AgentName`, `UpdatedBy`, `UpdateTask`, `TaskField`, `OldValue`, `NewValue`, `LastUpdatedOn`, `Status`, `ErrorMessage`)
VALUES
(@Agent_ID, @AgentName, @UpdatedBy, @UpdateTask, @TaskField, @OldValue, @NewValue, @UpdatedOn, @Status, @ErrorMessage)
</sql>.Value

    Using dbm = getDbManager()
        dbm.addParameter("@Agent_ID", AudiTrail.Agent_ID)
        dbm.addParameter("@AgentName", AudiTrail.AgentName)
        dbm.addParameter("@UpdatedBy", AudiTrail.UpdatedBy)
        dbm.addParameter("@UpdateTask", AudiTrail.UpdateTask)
        dbm.addParameter("@TaskField", AudiTrail.TaskField)
        dbm.addParameter("@OldValue", AudiTrail.OldValue)
        dbm.addParameter("@NewValue", AudiTrail.NewValue)
        dbm.addParameter("@UpdatedOn", AudiTrail.LastUpdatedOn)
        dbm.addParameter("@Status", AudiTrail.Status)
        dbm.addParameter("@ErrorMessage", AudiTrail.ErrorMessage)

        dbm.ExecuteDML(sql)
    End Using
End Sub