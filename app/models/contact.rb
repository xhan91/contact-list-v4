class Contact < ActiveRecord::Base
  has_many :phone_numbers

  validates :first_name, presence: true
  validates :last_name, presence: true
  validates :email, presence: true, uniqueness: true

  def name
    "#{first_name} #{last_name}"
  end

end