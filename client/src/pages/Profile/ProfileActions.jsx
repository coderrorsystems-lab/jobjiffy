import { motion } from 'framer-motion';
import { LogOut, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Modal } from '../../components/shared/Modal';
import { logout as logoutAPI } from '../../features/auth/services/authAPI';

export default function ProfileActions({ onLogout }) {
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  return (
    <>
      <motion.div
        className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-slate-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        <motion.button
          onClick={() => navigate('/user/settings')}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex-1 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-lg transition-colors"
        >
          Settings
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowConfirmation(true)}
          disabled={isLoggingOut}
          className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 disabled:bg-red-800 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <LogOut size={18} />
          {isLoggingOut ? 'Logging out...' : 'Logout'}
        </motion.button>
      </motion.div>

      {/* Logout Confirmation Modal */}
      <Modal
      isOpen={showConfirmation}
      onClose={() => setShowConfirmation(false)}
      title="Confirm Logout"
      size="sm"
      closeOnBackdropClick={!isLoggingOut}
    >
      <div className="space-y-6">
        {/* Icon and Message */}
        <div className="flex items-center gap-4 px-4 py-4 bg-red-500/10 rounded-lg border border-red-500/30">
          <AlertCircle className="text-red-500 flex-shrink-0" size={24} />
          <div>
            <p className="text-white font-semibold">Are you sure you want to logout?</p>
            <p className="text-slate-400 text-sm mt-1">You will be redirected to the home page.</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowConfirmation(false)}
            disabled={isLoggingOut}
            className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 text-white font-semibold rounded-lg transition-colors"
          >
            Cancel
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={async () => {
              setIsLoggingOut(true);
              try {
                await logoutAPI();
                setShowConfirmation(false);
                onLogout();
              } catch (error) {
                console.error('Logout failed:', error);
                // Still call onLogout to clear local state
                setShowConfirmation(false);
                onLogout();
              } finally {
                setIsLoggingOut(false);
              }
            }}
            disabled={isLoggingOut}
            className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-800 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <LogOut size={18} />
            {isLoggingOut ? 'Logging out...' : 'Yes, Logout'}
          </motion.button>
        </div>
      </div>
    </Modal>
    </>
  );
}
