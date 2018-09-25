module Gitlab
  module ImportExport
    class UploadsRestorer < UploadsSaver
      def restore
        Gitlab::ImportExport::UploadsManager.new(
          project: @project,
          shared: @shared
        ).restore
      rescue => e
        @shared.error(e)
        false
      end
    end
  end
end
