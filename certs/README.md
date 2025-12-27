# 🔐 SSL Sertifikaları

Bu klasör, QuickType Pro'nun HTTPS modunda çalışması için gereken SSL sertifikalarını içerir.

## 🚀 Kurulum

**Sertifika kurulumu uygulama içinden yapılır:**

1. QuickType Pro'yu başlatın
2. **Ayarlar** (⚙️) → **HTTPS / Security** bölümüne gidin
3. "**HTTPS Kur**" butonuna tıklayın
4. Kurulum otomatik tamamlanır

## 📱 Telefona Yükleme

1. Ayarlar'da "**Telefon için Dışa Aktar**" butonuna tıklayın
2. Masaüstüne kaydedilen `QuickType-RootCA.crt` dosyasını telefona gönderin 
3. Yükleyin:
   - **iPhone**: Ayarlar → Genel → VPN ve Cihaz Yönetimi → Yükle
   - **Android**: Dosyayı aç → CA Sertifikası olarak yükle

## 📁 Dosyalar

| Dosya | Açıklama |
|-------|----------|
| `localhost+2.pem` | SSL Sertifikası |
| `localhost+2-key.pem` | Özel Anahtar (paylaşmayın!) |

## ⚠️ Güvenlik

- Özel anahtar dosyalarını (`*-key.pem`) **asla paylaşmayın**
- Bu sertifikalar sadece yerel ağ içindir

## 💡 Sabit IP Tavsiyesi

IP adresiniz değişirse sertifika yenilenmeli. Bunu önlemek için **sabit IP** ayarlamanızı öneririz:

### Windows'ta Sabit IP Ayarlama

1. **Ayarlar** → **Ağ ve İnternet** → **Ethernet** (veya WiFi)
2. Bağlı ağınızın altında **Düzenle** tıklayın
3. **IP ayarlarını düzenle** → **Manuel** seçin
4. **IPv4** açın ve şunları girin:
   - **IP adresi**: `192.168.1.100` (veya başka bir kullanılmayan adres)
   - **Alt ağ maskesi**: `255.255.255.0`
   - **Ağ geçidi**: Router IP'niz (genellikle `192.168.1.1`)
   - **Tercih edilen DNS**: `8.8.8.8`
5. **Kaydet** tıklayın

> 📝 Not: IP adresinin başka bir cihaz tarafından kullanılmadığından emin olun.
