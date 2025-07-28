Public Sub InsertCentralAgentAuditTrail(ByVal AudiTrail As CentralAgentAuditTrailDTO)
    Dim sql = <sql>
INSERT INTO centralagentAuditrail
(Agent_ID, AgentName, UpdatedBy, UpdateTask, TaskField, OldValue, Newvalue, LastUpdatedOn, Status, ErrorMessage)
VALUES
(@Agent_ID, @AgentName, @UpdatedBy, @UpdateTask, @TaskField, @OldValue, @Newvalue, @UpdatedOn, @Status, @ErrorMessage)
</sql>.Value

    Using dbm = getDbManager()
        dbm.addParameter("@Agent_ID", AudiTrail.Agent_ID)
        dbm.addParameter("@AgentName", AudiTrail.AgentName)
        dbm.addParameter("@UpdatedBy", AudiTrail.UpdatedBy) 'environment.username
        dbm.addParameter("@UpdateTask", AudiTrail.UpdateTask)
        dbm.addParameter("@TaskField", AudiTrail.TaskField)
        dbm.addParameter("@OldValue", AudiTrail.OldValue)
        dbm.addParameter("@Newvalue", AudiTrail.NewValue)
        dbm.addParameter("@UpdatedOn", AudiTrail.LastUpdatedOn)
        dbm.addParameter("@Status", AudiTrail.Status)
        dbm.addParameter("@ErrorMessage", AudiTrail.ErrorMessage)

        dbm.ExecuteDML(sql)
    End Using
End Sub

Public Function GetAllAgentUpdateProgressInfo(Approot As AppRoot) As List(Of AgentUpdateProgressInfo)

    Dim cache = CType(_cache, RedisCache(Of AgentUpdateProgressInfo))

    Dim keyPrefix = $"AgentUpdateProgressCache-{_domainName}"

    Dim listOfAgentUpdateProgressInfo = cache.GetAllValueUsingKeyPrefix(keyPrefix)

    For Each agentProgressInfo As AgentUpdateProgressInfo In listOfAgentUpdateProgressInfo
        If agentProgressInfo.Status = AgentUpdateStatus.InProgress.ToString() AndAlso (DateTime.UtcNow - agentProgressInfo.LastUpdatedOn).TotalMinutes > 30 Then
            agentProgressInfo.Status = AgentUpdateStatus.Failed.ToString()
            agentProgressInfo.Error = "It's been 30 minutes, but there's no response from the agent, so marking the agent update status as failed."
            agentProgressInfo.IsErrorThrown = True
            agentProgressInfo.IsOperationCompleted = True
        End If

        If (agentProgressInfo.Status = AgentUpdateStatus.Failed.ToString()) Then
            'If (agentProgressInfo.Status = AgentUpdateStatus.Failed.ToString()) Or (agentProgressInfo.Status = AgentUpdateStatus.Completed.ToString()) Then

            Dim AuditTrail As New CentralAgentAuditTrailDTO

            AuditTrail.Agent_ID = agentProgressInfo.AgentID
            AuditTrail.AgentName = agentProgressInfo.AgentName
            'AuditTrail.UpdatedBy =
            AuditTrail.UpdateTask = agentProgressInfo.Task
            'AuditTrail.TaskField =
            'AuditTrail.OldValue =
            'AuditTrail.NewValue =
            AuditTrail.LastUpdatedOn = DateTime.UtcNow
            AuditTrail.Status = agentProgressInfo.Status
            AuditTrail.ErrorMessage = If(agentProgressInfo.Error Is Nothing, "", agentProgressInfo.Error.ToString())
            Dim obj As New AuditTrailDAO(Approot.Database)
            obj.InsertCentralAgentAuditTrail(AuditTrail)

        End If

    Next

    Return listOfAgentUpdateProgressInfo

End Function

Public Class CentralAgentAuditTrailDTO
    Public Property Agent_ID As Guid
    Public Property AgentName As String
    Public Property UpdatedBy As String
    Public Property UpdateTask As String
    Public Property TaskField As String
    Public Property OldValue As String
    Public Property NewValue As String
    Public Property LastUpdatedOn As DateTime
    Public Property Status As String ' Success / Failed / InProgress
    Public Property ErrorMessage As String
End Class