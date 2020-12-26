<?xml version="1.0"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
    <xsl:template match="/">
        <table id="menuTable" border="1" class="indent table table-hover">
            <thead class="thead-dark">
                <tr>
                    <th>Select</th>
                    <th>Item</th>
                    <th>Price</th>
                </tr>
            </thead>
            <tbody>
                <xsl:for-each select="motomenu/section">
                    <xsl:variable name="r_option" select="boolean(@radio)"/>
                    <xsl:variable name="item" select="@item"/>
                    <thead class="thead-light">
                        <tr class="">
                            <th colspan="3">
                                <xsl:value-of select="@name" />
                            </th>
                        </tr>
                    </thead>
                    <xsl:for-each select="entree">
                        <xsl:variable name="content" select="item"/>
                        <xsl:if test="$content!=''">
                            <tr>
                                <xsl:choose>
                                    <xsl:when test="$r_option = 'true'">
                                        <td align="center">
                                            <input type="radio">
                                                <xsl:attribute name="value">
                                                    <xsl:value-of select="item"/>
                                                </xsl:attribute>
                                                <xsl:attribute name="name">
                                                    <xsl:value-of select="$item"/>
                                                </xsl:attribute>
                                                <xsl:attribute name="class">
                                                    <xsl:value-of select="$item"/>
                                                </xsl:attribute>
                                            </input>
                                        </td>
                                    </xsl:when>
                                    <xsl:otherwise>
                                        <td align="center">
                                            <input type="checkbox">
                                                <xsl:attribute name="value">
                                                    <xsl:value-of select="item"/>
                                                </xsl:attribute>
                                                <xsl:attribute name="name">
                                                    <xsl:value-of select="$item"/>[]</xsl:attribute>
                                                <xsl:attribute name="class">
                                                    <xsl:value-of select="$item"/>
                                                </xsl:attribute>
                                            </input>
                                        </td>
                                    </xsl:otherwise>
                                </xsl:choose> 
                                <td>
                                    <xsl:value-of select="item" />
                                </td>
                                <td align="right">
                                    <xsl:value-of select="price" />
                                </td>
                            </tr>
                        </xsl:if>
                    </xsl:for-each>
                </xsl:for-each>
            </tbody>
        </table>
    </xsl:template>
</xsl:stylesheet>