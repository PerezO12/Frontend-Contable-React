/**
 * Página de listado de journals
 * Página principal del módulo de journals
 */
import { JournalList } from '../components/JournalList';
export function JournalListPage() {
    return (<div className="container mx-auto px-4 py-6">
      <JournalList />
    </div>);
}
export default JournalListPage;
