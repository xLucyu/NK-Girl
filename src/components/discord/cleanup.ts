export function scheduleComponentCleanup(args: {
  editReply: (options: { components: [] }) => Promise<unknown>;
  expiresAt: number; 
}) {
  const delay = Math.max(0, args.expiresAt - Date.now());

  setTimeout(() => {
    void args.editReply({ components: [] }).catch(() => {});
  }, delay);
}