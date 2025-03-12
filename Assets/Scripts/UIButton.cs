using UnityEngine;
using UnityEngine.UI;
using UnityEngine.EventSystems;

[RequireComponent(typeof(Button))]
public class UIButton : MonoBehaviour, IPointerDownHandler, IPointerUpHandler
{
    private Button button;
    private Vector3 originalScale;
    private Vector3 pressedScale = new Vector3(0.95f, 0.95f, 0.95f);
    
    [SerializeField] private AudioClip clickSound;
    private AudioSource audioSource;

    private void Awake()
    {
        button = GetComponent<Button>();
        originalScale = transform.localScale;
        
        // Ajouter un AudioSource si nécessaire
        if (clickSound != null && !TryGetComponent(out audioSource))
        {
            audioSource = gameObject.AddComponent<AudioSource>();
            audioSource.playOnAwake = false;
            audioSource.clip = clickSound;
        }
    }

    public void OnPointerDown(PointerEventData eventData)
    {
        if (button.interactable)
        {
            transform.localScale = pressedScale;
        }
    }

    public void OnPointerUp(PointerEventData eventData)
    {
        if (button.interactable)
        {
            transform.localScale = originalScale;
            if (audioSource != null && clickSound != null)
            {
                audioSource.PlayOneShot(clickSound);
            }
        }
    }

    // Méthodes pour les actions des boutons
    public void OnPlayButton()
    {
        UIManager.Instance.StartGame();
    }

    public void OnPauseButton()
    {
        GameManager.Instance.PauseGame();
    }

    public void OnResumeButton()
    {
        GameManager.Instance.ResumeGame();
    }

    public void OnRestartButton()
    {
        // TODO: Implémenter la logique de redémarrage
    }

    public void OnMainMenuButton()
    {
        UIManager.Instance.ShowMainMenu();
    }

    public void OnQuitButton()
    {
        #if UNITY_EDITOR
            UnityEditor.EditorApplication.isPlaying = false;
        #else
            Application.Quit();
        #endif
    }
} 