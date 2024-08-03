import { BASE_URI } from '@/constants';
import { useAddPopup } from '@/state/application/hooks';
export default function useNewsletterSubscriber() {
  const addPopup = useAddPopup();

  return async function handleFormSubmit(values, actions) {
    try {
      actions.setSubmitting(true);
      const res = await fetch(`${BASE_URI}/newsletter/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });
      actions.setSubmitting(false);
      if (res.status === 201) {
        actions.resetForm();
        addPopup({
          content: {
            summary: 'You have successfully subscribed to our newsletter!',
            success: true,
          },
        });
      } else {
        addPopup({
          content: {
            summary: 'Something went wrong, please try again later.',
            success: false,
          },
        });
      }
    } catch (error) {
      console.error(error);
      actions.setSubmitting(false);
    }
  };
}
