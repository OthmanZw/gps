using UnityEngine;
using UnityEngine.EventSystems;

public class ColorElement : MonoBehaviour, IPointerClickHandler
{
    public Color currentColor;
    private SpriteRenderer spriteRenderer;
    private bool isSelected;

    // Événements
    public delegate void ColorElementClicked(ColorElement element);
    public static event ColorElementClicked OnElementClicked;

    private void Awake()
    {
        spriteRenderer = GetComponent<SpriteRenderer>();
        if (spriteRenderer == null)
        {
            spriteRenderer = gameObject.AddComponent<SpriteRenderer>();
        }
        UpdateColor();
    }

    private void Start()
    {
        isSelected = false;
    }

    public void SetColor(Color newColor)
    {
        currentColor = newColor;
        UpdateColor();
    }

    private void UpdateColor()
    {
        if (spriteRenderer != null)
        {
            spriteRenderer.color = currentColor;
        }
    }

    public void OnPointerClick(PointerEventData eventData)
    {
        if (!GameManager.Instance.IsGamePaused)
        {
            isSelected = !isSelected;
            OnElementClicked?.Invoke(this);
            // Animation de sélection
            transform.localScale = isSelected ? Vector3.one * 1.2f : Vector3.one;
        }
    }

    public void MixWith(ColorElement other)
    {
        if (other != null)
        {
            // Mélange simple des couleurs
            Color mixedColor = Color.Lerp(currentColor, other.currentColor, 0.5f);
            SetColor(mixedColor);
            other.SetColor(mixedColor);
        }
    }

    private void OnDestroy()
    {
        // Nettoyage des événements
        OnElementClicked = null;
    }
} 