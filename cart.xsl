<?xml version="1.0"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
    <xsl:template match="/">
        <table id="menuTable" class="indent table table-hover">
            <thead class="thead-dark">
                <tr>
                    <th>Item</th>
                    <th>Price</th>
                    <th>Del.</th>
                </tr>
            </thead>
            <tbody>
                <xsl:for-each select="cart/section/entree">
                    <xsl:variable name="content" select="item"/>
                    <xsl:if test="$content!=''">
                        
                        <tr>

                            <td>
                                <xsl:value-of select="item"/>
                            </td>
                            <td class="price">
                                <xsl:value-of select="price"/>
                            </td>

                            

                            <td width="5">
                                <form action="/post/json/cart_rm" method="post">

                                    <input type="hidden" name="item">
                                        <xsl:attribute name="value">
                                            <xsl:value-of select="item"/>
                                        </xsl:attribute>
                                        
                                    </input>

                                    <input type="hidden" name="price">
                                        <xsl:attribute name="value">
                                            <xsl:value-of select="price"/>
                                        </xsl:attribute>
                                    </input>
                                    
                                    <button type="submit" class="btn btn-danger btn-sm remove_item">X</button>
                                </form>
                            </td>

                        </tr>
                        
                    </xsl:if>
                </xsl:for-each>   
            </tbody>
        </table>
        <xsl:for-each select="cart/section">
            <div class="btn btn-light btn-lg">
                Bill Total: 
                <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
	                viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;" xml:space="preserve" width="24" height="24">
                    <path d="M256,0C114.848,0,0,114.848,0,256s114.848,256,256,256s256-114.848,256-256S397.152,0,256,0z M256,480
                        C132.48,480,32,379.52,32,256S132.48,32,256,32s224,100.48,224,224S379.52,480,256,480z"/>
                    <path d="M310.976,339.744C299.072,347.872,285.952,352,272,352c-29.472,0-55.008-19.456-68.864-48H256c8.832,0,16-7.168,16-16
                        c0-8.832-7.168-16-16-16h-62.656c-0.736-5.216-1.344-10.528-1.344-16s0.608-10.784,1.344-16H272c8.832,0,16-7.168,16-16
                        c0-8.832-7.168-16-16-16h-68.864c13.856-28.544,39.392-48,68.864-48c13.952,0,27.072,4.128,38.976,12.256
                        c7.296,4.96,17.28,3.136,22.24-4.192c4.992-7.296,3.104-17.248-4.192-22.24C311.936,134.176,292.224,128,272,128
                        c-46.88,0-87.008,33.184-103.68,80H144c-8.832,0-16,7.168-16,16c0,8.832,7.168,16,16,16h17.408
                        c-0.576,5.312-1.408,10.528-1.408,16s0.832,10.688,1.408,16H144c-8.832,0-16,7.168-16,16c0,8.832,7.168,16,16,16h24.32
                        c16.672,46.816,56.8,80,103.68,80c20.224,0,39.936-6.176,57.024-17.824c7.296-4.992,9.184-14.944,4.192-22.24
                        C328.256,336.64,318.272,334.784,310.976,339.744z"/>
                </svg>
                <xsl:value-of select="billTotal"/>                
            </div>
        </xsl:for-each>
    </xsl:template>
</xsl:stylesheet>