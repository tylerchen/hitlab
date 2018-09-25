require 'spec_helper'

describe NamespacesHelper do
  let!(:admin) { create(:admin) }
  let!(:admin_group) { create(:group, :private) }
  let!(:user) { create(:user) }
  let!(:user_group) { create(:group, :private) }

  before do
    admin_group.add_owner(admin)
    user_group.add_owner(user)
  end

  describe '#namespaces_options' do
    it 'returns groups without being a member for admin' do
      allow(helper).to receive(:current_user).and_return(admin)

      options = helper.namespaces_options(user_group.id, display_path: true, extra_group: user_group.id)

      expect(options).to include(admin_group.name)
      expect(options).to include(user_group.name)
    end

    it 'returns only allowed namespaces for user' do
      allow(helper).to receive(:current_user).and_return(user)

      options = helper.namespaces_options

      expect(options).not_to include(admin_group.name)
      expect(options).to include(user_group.name)
      expect(options).to include(user.name)
    end

    it 'avoids duplicate groups when extra_group is used' do
      allow(helper).to receive(:current_user).and_return(admin)

      options = helper.namespaces_options(user_group.id, display_path: true, extra_group: build(:group, name: admin_group.name))

      expect(options.scan("data-name=\"#{admin_group.name}\"").count).to eq(1)
      expect(options).to include(admin_group.name)
    end

    it 'selects existing group' do
      allow(helper).to receive(:current_user).and_return(admin)

      options = helper.namespaces_options(:extra_group, display_path: true, extra_group: user_group)

      expect(options).to include("selected=\"selected\" value=\"#{user_group.id}\"")
      expect(options).to include(admin_group.name)
    end

    it 'selects the new group by default' do
      # Ensure we don't select a group with the same name
      create(:group, name: 'new-group', path: 'another-path')

      allow(helper).to receive(:current_user).and_return(user)

      options = helper.namespaces_options(:extra_group, display_path: true, extra_group: build(:group, name: 'new-group', path: 'new-group'))

      expect(options).to include(user_group.name)
      expect(options).not_to include(admin_group.name)
      expect(options).to include("selected=\"selected\" value=\"-1\"")
    end

    it 'falls back to current user selection' do
      allow(helper).to receive(:current_user).and_return(user)

      options = helper.namespaces_options(:extra_group, display_path: true, extra_group: build(:group, name: admin_group.name))

      expect(options).to include(user_group.name)
      expect(options).not_to include(admin_group.name)
      expect(options).to include("selected=\"selected\" value=\"#{user.namespace.id}\"")
    end

    it 'returns only groups if groups_only option is true' do
      allow(helper).to receive(:current_user).and_return(user)

      options = helper.namespaces_options(nil, groups_only: true)

      expect(options).not_to include(user.name)
      expect(options).to include(user_group.name)
    end

    context 'when nested groups are available', :nested_groups do
      it 'includes groups nested in groups the user can administer' do
        allow(helper).to receive(:current_user).and_return(user)
        child_group = create(:group, :private, parent: user_group)

        options = helper.namespaces_options

        expect(options).to include(child_group.name)
      end

      it 'orders the groups correctly' do
        allow(helper).to receive(:current_user).and_return(user)
        child_group = create(:group, :private, parent: user_group)
        other_child = create(:group, :private, parent: user_group)
        sub_child = create(:group, :private, parent: child_group)

        expect(helper).to receive(:options_for_group)
                            .with([user_group, child_group, sub_child, other_child], anything)
                            .and_call_original
        allow(helper).to receive(:options_for_group).and_call_original

        helper.namespaces_options
      end
    end
  end
end
