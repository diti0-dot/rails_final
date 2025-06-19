class ApplicationRecord < ActiveRecord::Base
  primary_abstract_class
  audited 
end
