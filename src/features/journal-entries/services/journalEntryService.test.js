// Simple test to verify bulkRestoreToDraft payload format
import { JournalEntryService } from './journalEntryService';
import { apiClient } from '../../../shared/api/client';

// Mock the apiClient
jest.mock('../../../shared/api/client', () => ({
  apiClient: {
    post: jest.fn().mockResolvedValue({ data: {} })
  }
}));

describe('JournalEntryService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('bulkRestoreToDraft formats payload correctly', async () => {
    const entryIds = ['id1', 'id2', 'id3'];
    const reason = 'Test reason';
    
    await JournalEntryService.bulkRestoreToDraft(entryIds, reason);
    
    expect(apiClient.post).toHaveBeenCalledWith(
      `${JournalEntryService.BASE_URL}/bulk-restore-to-draft`,
      {
        entry_ids: entryIds,
        reason,
        operation: 'restore_to_draft'
      }
    );
  });
});
