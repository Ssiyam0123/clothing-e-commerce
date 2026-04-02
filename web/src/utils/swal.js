import Swal from 'sweetalert2';

const getSwalConfig = () => {
  const isDark = document.documentElement.classList.contains('dark');
  return {
    background: isDark ? '#0a0a0a' : '#ffffff',
    color: isDark ? '#ffffff' : '#000000',
    backdrop: isDark ? 'rgba(0,0,0,0.8)' : 'rgba(0,0,0,0.4)',
    confirmButton: isDark ? 'bg-white text-black' : 'bg-zinc-900 text-white',
  };
};

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  customClass: {
    popup: 'rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xl',
    title: 'text-xs font-black uppercase tracking-widest',
  }
});

const Modal = Swal.mixin({
  customClass: {
    popup: 'rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 shadow-2xl px-6 py-8',
    title: 'text-2xl md:text-3xl font-black uppercase tracking-tighter mt-4',
    htmlContainer: 'text-sm font-medium leading-relaxed opacity-80',
    confirmButton: 'bg-zinc-900 dark:bg-white text-white dark:text-black px-10 py-4 rounded-full font-black uppercase tracking-[0.2em] text-[10px] hover:scale-105 active:scale-95 transition-all shadow-xl mx-2 mt-6',
    cancelButton: 'bg-rose-50 dark:bg-rose-500/10 text-rose-500 dark:text-rose-400 border border-rose-100 dark:border-rose-500/20 px-10 py-4 rounded-full font-black uppercase tracking-[0.2em] text-[10px] hover:bg-rose-600 hover:text-white dark:hover:bg-rose-600 transition-all mx-2 mt-6',
    actions: 'flex flex-wrap justify-center w-full gap-4 mt-8',
  },
  buttonsStyling: false,
});


export const swalToast = (title = 'Success!', icon = 'success') => {
  const config = getSwalConfig();
  return Toast.fire({
    icon,
    title,
    background: config.background,
    color: config.color,
    iconColor: icon === 'success' ? '#10b981' : '#f43f5e'
  });
};

export const swalSuccess = (title, text) => {
  const config = getSwalConfig();
  return Modal.fire({
    icon: 'success',
    title,
    text,
    background: config.background,
    color: config.color,
    backdrop: `rgba(0,0,0,0.5) blur(8px)`,
    iconColor: '#10b981',
  });
};

export const swalError = (title = 'Action Failed', text = 'Something went wrong.') => {
  const config = getSwalConfig();
  return Modal.fire({
    icon: 'error',
    title,
    text,
    background: config.background,
    color: config.color,
    backdrop: `rgba(0,0,0,0.5) blur(8px)`,
    iconColor: '#f43f5e',
  });
};

export const swalConfirm = async (title = 'Are you sure?', text = "You won't be able to revert this!") => {
  const config = getSwalConfig();
  const result = await Modal.fire({
    icon: 'warning',
    title,
    text,
    background: config.background,
    color: config.color,
    backdrop: `rgba(0,0,0,0.5) blur(8px)`,
    iconColor: '#f59e0b',
    showCancelButton: true,
    confirmButtonText: 'Yes, Proceed',
    cancelButtonText: 'Cancel',
    reverseButtons: true,
  });

  return result.isConfirmed;
};