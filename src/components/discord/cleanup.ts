export function scheduleComponentCleanup(args: {
  editReply: (options: { components: [] }) => Promise<unknown>;
  expiresAt: number; 
  onExpire?: () => void;
}) {

  const delay = Math.max(0, args.expiresAt - Date.now());

  setTimeout(() => {
    args.onExpire?.();
    void args.editReply({ components: [] }).catch(() => {});
  }, delay);
}