export default function PaymentTable({ payments }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-200 dark:border-slate-700">
            <th className="text-left py-4 px-4 font-semibold text-slate-900 dark:text-white">
              User
            </th>
            <th className="text-left py-4 px-4 font-semibold text-slate-900 dark:text-white">
              Service
            </th>
            <th className="text-left py-4 px-4 font-semibold text-slate-900 dark:text-white">
              Date
            </th>
            <th className="text-right py-4 px-4 font-semibold text-slate-900 dark:text-white">
              Amount
            </th>
            <th className="text-left py-4 px-4 font-semibold text-slate-900 dark:text-white">
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          {payments.map((payment) => (
            <tr
              key={payment.id}
              className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
            >
              <td className="py-4 px-4 text-slate-900 dark:text-white font-medium">
                {payment.User}
              </td>
              <td className="py-4 px-4 text-slate-600 dark:text-slate-400">
                {payment.service}
              </td>
              <td className="py-4 px-4 text-slate-600 dark:text-slate-400 text-sm">
                {payment.date}
              </td>
              <td className="py-4 px-4 text-right text-green-600 dark:text-green-400 font-semibold">
                {payment.amount}
              </td>
              <td className="py-4 px-4">
                <span className="px-3 py-1 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 rounded-full text-xs font-medium">
                  {payment.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
