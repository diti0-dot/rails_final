ActiveSupport.on_load(:active_record) do
  Audited::Audit.after_create_commit do |audit|
    AuditLogger.log(audit)
  end
end