import { redirect } from 'next/navigation';

/** Preserve existing team/demo bookmarks after the UI handoff. */
export default function ExampleRedirect() { redirect('/#smoke'); }
