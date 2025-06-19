class AuditLogger
  def self.log(audit)
    log_file = Rails.root.join('log', 'audits.log')
    FileUtils.mkdir_p(File.dirname(log_file))
    
    File.open(log_file, 'a') do |f|
      f.puts({
        timestamp: audit.created_at,
        user: audit.user&.email,
        action: audit.action,
        record_type: audit.auditable_type,
        record_id: audit.auditable_id,
        changes: audit.audited_changes
      }.to_json)
    end
  end
end