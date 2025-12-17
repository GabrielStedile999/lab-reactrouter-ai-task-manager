// Catch-all route for unmatched paths
// This route doesn't have a loader or action to avoid interfering with
// POST requests that should go to their specific route actions
export default function CatchAll() {
	return null;
}
