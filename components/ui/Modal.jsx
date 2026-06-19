import { Dialog, Transition } from "@headlessui/react";
import React, { Fragment, useState } from "react";
import Icon from "@/components/ui/Icon";

const Modal = ({
  activeModal,
  onClose,
  noFade,
  disableBackdrop,
  className = "max-w-xl",
  children,
  footerContent,
  centered = false,
  scrollContent,
  fixedLayout = false,
  themeClass = "bg-slate-100 text-slate-800 border-b border-slate-200",
  title = "Basic Modal",
  uncontrol,
  label = "Basic Modal",
  labelClass,
  ref,
}) => {
  const [showModal, setShowModal] = useState(false);

  const closeModal = () => setShowModal(false);
  const openModal = () => setShowModal(!showModal);
  const returnNull = () => null;

  const panelClass = fixedLayout
    ? `flex w-full max-h-[min(480px,calc(100vh-96px))] flex-col overflow-hidden rounded-none border border-slate-200 bg-white shadow-xl ${className}`
    : `w-full overflow-hidden rounded-none border border-slate-200 bg-white shadow-xl ${className}`;

  const bodyClass = fixedLayout
    ? "min-h-0 flex-1 overflow-y-auto overscroll-contain bg-slate-50 px-6 py-5"
    : `bg-slate-50 px-6 py-8 ${scrollContent ? "max-h-[400px] overflow-y-auto" : ""}`;

  const renderDialogBody = (isOpen, handleClose) => (
    <>
      {!disableBackdrop && (
        <Transition.Child
          as={Fragment}
          enter={noFade ? "" : "duration-200 ease-out"}
          enterFrom={noFade ? "" : "opacity-0"}
          enterTo={noFade ? "" : "opacity-100"}
          leave={noFade ? "" : "duration-150 ease-in"}
          leaveFrom={noFade ? "" : "opacity-100"}
          leaveTo={noFade ? "" : "opacity-0"}
        >
          <div className="fixed inset-0 bg-slate-900/50" />
        </Transition.Child>
      )}

      <div className="fixed inset-0 overflow-hidden">
        <div
          className={`flex h-full justify-center p-4 sm:p-6 ${
            centered || fixedLayout ? "items-center" : "items-start"
          }`}
        >
          <Transition.Child
            as={Fragment}
            enter={noFade ? "" : "duration-200 ease-out"}
            enterFrom={noFade ? "" : "opacity-0 scale-95"}
            enterTo={noFade ? "" : "opacity-100 scale-100"}
            leave={noFade ? "" : "duration-150 ease-in"}
            leaveFrom={noFade ? "" : "opacity-100 scale-100"}
            leaveTo={noFade ? "" : "opacity-0 scale-95"}
          >
            <Dialog.Panel className={panelClass}>
              <div
                className={`flex shrink-0 items-center justify-between px-5 py-4 ${themeClass}`}
              >
                <h2 className="text-base font-medium capitalize">{title}</h2>
                <button
                  type="button"
                  onClick={handleClose}
                  className="text-xl text-slate-500 hover:text-slate-700"
                >
                  <Icon icon="heroicons-outline:x" />
                </button>
              </div>

              <div className={bodyClass}>{children}</div>

              {footerContent && (
                <div className="flex shrink-0 justify-end gap-3 border-t border-slate-200 bg-white px-5 py-3">
                  {footerContent}
                </div>
              )}
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </div>
    </>
  );

  return uncontrol ? (
    <>
      <button type="button" onClick={openModal} className={`btn ${labelClass}`}>
        {label}
      </button>
      <Transition appear show={showModal} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-[99999]"
          onClose={!disableBackdrop ? closeModal : returnNull}
        >
          {renderDialogBody(showModal, closeModal)}
        </Dialog>
      </Transition>
    </>
  ) : (
    <Transition appear show={activeModal} as={Fragment}>
      <Dialog as="div" className="relative z-[99999]" onClose={onClose}>
        {renderDialogBody(activeModal, onClose)}
      </Dialog>
    </Transition>
  );
};

export default Modal;
