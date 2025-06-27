import type { JournalListItem } from '../types';
interface JournalListProps {
    onJournalSelect?: (journal: JournalListItem) => void;
    showActions?: boolean;
}
export declare function JournalList({ onJournalSelect, showActions }: JournalListProps): import("react").JSX.Element;
export default JournalList;
